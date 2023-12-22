const express = require("express");
const cors = require("cors");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const secret = "Fullstack-Login-2023";

// CREATE Provider
router.post("/create", (req, res) => {
  const { name, birthday, address, email, phone, gender, password } = req.body;

  // Check if the email already exists
  const emailCheckQuery = "SELECT * FROM provider WHERE provider_email = ?";
  pool.query(emailCheckQuery, [email], (emailCheckErr, emailCheckResults) => {
    if (emailCheckErr) {
      console.log("Error while checking email existence", emailCheckErr);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (emailCheckResults.length > 0) {
      // Email already exists
      return res.status(409).json({ message: "Email already exists." });
    }

    // If email doesn't exist, proceed with user creation
    const createUserQuery =
      "INSERT INTO provider (provider_name, provider_DateOfBirth, provider_address, provider_email, provider_phone, provider_gender, provider_password) VALUES (?, ?, ?, ?, ?, ?, ?)";

    pool.query(
      createUserQuery,
      [name, birthday, address, email, phone, gender, password],
      (createUserErr, createUserResults) => {
        if (createUserErr) {
          console.log(
            "Error while inserting a user into the database",
            createUserErr
          );
          return res
            .status(400)
            .json({ message: "Failed to create a new user." });
        }

        return res
          .status(201)
          .json({ message: "New user successfully created!" });
      }
    );
  });
});

// Start Validate Login //
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  pool.getConnection((err, pool) => {
    if (err) {
      console.error("Database pool error:", err);
      res
        .status(500)
        .json({ error: "An error occurred while checking credentials." });
      return;
    }
    // Query the database to check credentials
    pool.query(
      "SELECT * FROM provider WHERE provider_email = ? AND provider_password = ? ",
      [email, password],
      (queryError, results) => {
        pool.release();

        if (queryError) {
          console.error("Query error:", queryError);
          res
            .status(500)
            .json({ error: "An error occurred while checking credentials." });
          return;
        }

        if (results.length === 1) {
          // Generate a JWT token and send it to the client
          const user = results[0];
          console.log(results[0].provider_email);
          // const token = jwt.sign({ id: user.provider_id, email: user.provider_email }, 'your-secret-key');

          // Inside your login route
          const email = results[0].provider_email;
          const access_token = jwtGenerate(email);
          const refresh_token = jwtRefreshTokenGenerate(email);

          res.json({
            access_token,
            refresh_token,
          });
        } else {
          res.json({ isAuthenticated: false });
        }
      }
    );
  });
});

const jwtGenerate = (email) => {
  const accessToken = jwt.sign(
    { email },
    secret, // Use the secret key
    { expiresIn: "1h", algorithm: "HS256" }
  );

  return accessToken;
};

const jwtRefreshTokenGenerate = (email) => {
  const refreshToken = jwt.sign(
    { email },
    secret, // Use the secret key
    { expiresIn: "1d", algorithm: "HS256" }
  );

  return refreshToken;
};

const jwtValidate = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", ""); // Use optional chaining for safety

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.sendStatus(400);

      console.log(decoded);
      const email = decoded.email;
      console.log("email " + email);
      pool.query(
        "SELECT * FROM provider WHERE provider_email = ?",
        [email],
        (queryError, results) => {
          if (queryError) {
            console.error("Database query error:", queryError);
            return res.sendStatus(500);
          }

          if (results && results.length > 0) {
            const user = results[0];
            req.user = user; // Store the user object
            next();
          } else {
            return res.sendStatus(403);
          }
        }
      );
    });
  } catch (error) {
    return res.sendStatus(403);
  }
};

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token is not provided." });
  }

  jwt.verify(token, secret, { maxAge: "1h" }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const email = decoded.email; // Assuming email is used as an identifier

    // Query the database to retrieve the user (provider) object associated with the email
    pool.query(
      "SELECT * FROM provider WHERE provider_email = ?",
      [email],
      (queryError, results) => {
        if (queryError) {
          console.error("Database query error:", queryError);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results && results.length > 0) {
          req.user = results[0]; // Store the user (provider) object in the request
          next();
        } else {
          return res
            .status(403)
            .json({ message: "User not found for the provided token." });
        }
      }
    );
  });
}
router.get("/", jwtValidate, (req, res) => {
  const user = req.user;
  res.json({
    message: `Hello, user with email: ${user.provider_email}!`,
    user,
  });
});

// Protect a route using the verifyToken middleware
router.get("/protected-route", verifyToken, (req, res) => {
  // Your protected route logic here
  res.json({ message: "This is a protected route." });
});
// End Validate Login //

// Test show provider service in ProviderHome //
router.get("/api/services", jwtValidate, (req, res) => {
  // Check if the user is authenticated and authorized

  const userId = req.user.provider_id;
  // Fetch the list of services (you may use a database query here)
  const sql2 = "SELECT service_id FROM provideservice WHERE provider_id = ?";

  pool.query(sql2, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching services: " + error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    // Return the list of services as a JSON response
    res.json({ services: results });
  });
});

// Show Provider Profile //
router.get("/api/profile", jwtValidate, (req, res) => {
  // Check if the user is authenticated and authorized
  const userId = req.user.provider_id;
  // Fetch the provider's information (you may use a database query here)
  const sql = "SELECT * FROM provider WHERE provider_id = ?";

  pool.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching provider information: " + error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Return the provider's information as a JSON response
    if (results.length > 0) {
      res.json({ provider: results[0] }); // Assuming you expect one result or adjust as needed
    } else {
      res.status(404).json({ error: "Provider not found" });
    }
  });
});

// Update Provider Profile //
router.patch("/update-profile", jwtValidate, (req, res) => {
  const userId = req.user.provider_id; // Retrieve the provider's ID from the token
  const { address, phone, newPassword, email } = req.body;

  // Create an array to store the parameters for the SQL query
  const updateParams = [];

  // Create the SQL query based on the provided fields
  let query = "UPDATE provider SET";

  if (address !== undefined) {
    query += " provider_address = ?,";
    updateParams.push(address);
  }

  if (phone !== undefined) {
    query += " provider_phone = ?,";
    updateParams.push(phone);
  }

  if (newPassword !== undefined && newPassword !== "") {
    query += " provider_password = ?,";
    updateParams.push(newPassword);
  }

  if (email !== undefined) {
    query += " provider_email = ?,";
    updateParams.push(email);
  }

  // Remove the trailing comma and add the WHERE clause
  query = query.slice(0, -1) + " WHERE provider_id = ?";
  updateParams.push(userId);

  try {
    pool.query(query, updateParams, (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(400).json({ message: "Update failed" });
      }

      if (results.affectedRows === 0) {
        // No rows were updated, indicating that the user ID might be incorrect
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ message: "Provider profile updated successfully!" });
    });
  } catch (err) {
    console.error("Exception:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Select Categories
router.get("/api/categories", jwtValidate, (req, res) => {
  const sql = "SELECT category_id, category_title FROM category";

  pool.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ categories: results });
  });
});

// Show Provider Service
router.get("/api/getservices", jwtValidate, (req, res) => {
  // Check if the user is authenticated and authorized
  const userId = req.user.provider_id;

  // Create a SELECT SQL query to retrieve information about services
  const getServicesSql = `
    SELECT
      service.service_id,
      service.service_title,
      service.service_description,
      service.service_cost,
      category.category_title
    FROM
      service
      INNER JOIN provideservice ON service.service_id = provideservice.service_id
      INNER JOIN category ON service.category_id = category.category_id
    WHERE
      provideservice.provider_id = ?
  `;

  pool.query(getServicesSql, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching services data: " + error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Send the retrieved services data to the frontend
    res.json({ services: results });
  });
});

// Add Service Provider //
router.post("/api/addservice", jwtValidate, (req, res) => {
  // Check if the user is authenticated and authorized
  const userId = req.user.provider_id;

  // Extract service data from the request body (assuming it's sent as JSON)
  const { title, description, cost, category } = req.body;

  // Create an INSERT SQL query to insert the service data into the 'service' table
  const serviceSql =
    "INSERT INTO service (service_title, service_description, service_cost, category_id) VALUES (?, ?, ?, ?)";

  pool.query(
    serviceSql,
    [title, description, cost, category],
    (error, serviceResult) => {
      if (error) {
        console.error("Error inserting service data: " + error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const getServiceIdSql = "SELECT LAST_INSERT_ID() as serviceId";

      pool.query(getServiceIdSql, (getIdError, getIdResult) => {
        if (getIdError) {
          console.error("Error fetching service ID: " + getIdError);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        const serviceId = getIdResult[0].serviceId;

        // Check the value of serviceId
        console.log("Service ID:", serviceId);

        // Check if serviceId is a valid value
        if (serviceId === 0) {
          console.error("Invalid service_id obtained");
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // Continue with the rest of your code
        const provideserviceSql =
          "INSERT INTO provideservice (provider_id, service_id) VALUES (?, ?)";

        pool.query(
          provideserviceSql,
          [userId, serviceId],
          (provideserviceError) => {
            if (provideserviceError) {
              console.error(
                "Error inserting provideservice data: " + provideserviceError
              );
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }

            res.json({ message: "Service added successfully" });
          }
        );
      });
    }
  );
});

// Show Reservation
router.get("/reservation/:status", jwtValidate, (req, res) => {
  const provider_id = req.user.provider_id;
  const { status } = req.params;

  pool.query(
    "SELECT r.*, s.provider_address AS provider_address FROM reservation r " +
      "LEFT JOIN provider s ON r.provider_id = s.provider_id " +
      "WHERE r.provider_id = ? AND r.status = ?",
    [provider_id, status],
    (err, results, fields) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});

//update reservation status
router.patch("/status", (req, res) => {
  const rid = req.body.reservation_id;
  const newStatus = req.body.status;

  try {
    pool.query(
      "UPDATE reservation SET status = ? WHERE reservation_id = ?",
      [newStatus, rid],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json({ message: "The resevation is completed!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// Show booking Details
router.get("/bookingDetails/:reservation_id", jwtValidate, (req, res) => {
  const { reservation_id } = req.params;
  pool.query(
    "SELECT reservation.reservation_id, reservation.reservation_date, reservation.reservation_time, provider.provider_address AS provider_location, provider.provider_name AS customer_name " +
      "FROM reservation " +
      "JOIN provider ON reservation.provider_id = provider.provider_id " +
      "WHERE reservation.reservation_id = ?",
    [reservation_id],
    (queryError, results) => {
      if (queryError) {
        console.error("Database query error:", queryError);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results && results.length > 0) {
        req.user = results[0]; // Store the user (provider) object in the request
        console.log(results);
        return res.json(results); // Send the results as a JSON response
      } else {
        return res
          .status(403)
          .json({ message: "User not found for the provided token." });
      }
    }
  );
});

module.exports = router;
