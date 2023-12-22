const express = require("express");
const cors = require("cors");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const secret = "Fullstack-Login-2023";

// CREATE seeker and Check email
router.post("/create", (req, res) => {
  const { name, birthday, address, email, phone, gender, password } = req.body;

  // Check if the email already exists
  const emailCheckQuery = "SELECT * FROM seeker WHERE seeker_email = ?";
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
      "INSERT INTO seeker (seeker_name, seeker_DateOfBirth, seeker_address, seeker_email, seeker_phone, seeker_gender, seeker_password) VALUES (?, ?, ?, ?, ?, ?, ?)";

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
      "SELECT * FROM seeker WHERE seeker_email = ? AND seeker_password = ? ",
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
          console.log(results[0].seeker_email);
          // const token = jwt.sign({ id: user.seeker_id, email: user.seeker_email }, 'your-secret-key');

          // Inside your login route
          const email = results[0].seeker_email;
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
        "SELECT * FROM seeker WHERE seeker_email = ?",
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

    // Query the database to retrieve the user (seeker) object associated with the email
    pool.query(
      "SELECT * FROM seeker WHERE seeker_email = ?",
      [email],
      (queryError, results) => {
        if (queryError) {
          console.error("Database query error:", queryError);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results && results.length > 0) {
          req.user = results[0]; // Store the user (seeker) object in the request
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
    message: `Hello, user with email: ${user.seeker_email}!`,
    user,
  });
});

// Protect a route using the verifyToken middleware
router.get("/protected-route", verifyToken, (req, res) => {
  // Your protected route logic here
  res.json({ message: "This is a protected route." });
});
// End Validate Login //

// Show seeker Profile //
router.get("/api/profile", jwtValidate, (req, res) => {
  // Check if the user is authenticated and authorized
  const userId = req.user.seeker_id;
  // Fetch the seeker's information (you may use a database query here)
  const sql = "SELECT * FROM seeker WHERE seeker_id = ?";

  pool.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching seeker information: " + error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Return the seeker's information as a JSON response
    if (results.length > 0) {
      res.json({ seeker: results[0] }); // Assuming you expect one result or adjust as needed
    } else {
      res.status(404).json({ error: "seeker not found" });
    }
  });
});

// Update seeker Profile //
router.patch("/update-profile", jwtValidate, (req, res) => {
  const userId = req.user.seeker_id; // Retrieve the seeker's ID from the token
  const { address, phone, newPassword, email } = req.body;

  // Create an array to store the parameters for the SQL query
  const updateParams = [];

  // Create the SQL query based on the provided fields
  let query = "UPDATE seeker SET";

  if (address !== undefined) {
    query += " seeker_address = ?,";
    updateParams.push(address);
  }

  if (phone !== undefined) {
    query += " seeker_phone = ?,";
    updateParams.push(phone);
  }

  if (newPassword !== undefined && newPassword !== "") {
    query += " seeker_password = ?,";
    updateParams.push(newPassword);
  }

  if (email !== undefined) {
    query += " seeker_email = ?,";
    updateParams.push(email);
  }

  // Remove the trailing comma and add the WHERE clause
  query = query.slice(0, -1) + " WHERE seeker_id = ?";
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

      res.status(200).json({ message: "Seeker profile updated successfully!" });
    });
  } catch (err) {
    console.error("Exception:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Show Worker Profile //
router.get("/worker-profile/:provider_id", jwtValidate, (req, res) => {
  // Check if the user is authenticated and authorized
  const userId = req.user.seeker_id;
  const { provider_id } = req.params;

  // Fetch the provider's information including services
  const sql =
    "SELECT provider.*, GROUP_CONCAT(service.service_title) AS service_titles, GROUP_CONCAT(service.category_id) AS category_ids " +
    "FROM provider " +
    "JOIN provideservice ON provider.provider_id = provideservice.provider_id " +
    "JOIN service ON provideservice.service_id = service.service_id " +
    "WHERE provider.provider_id = ? " +
    "GROUP BY provider.provider_id";

  pool.query(sql, [provider_id], (error, results) => {
    if (error) {
      console.error("Error fetching provider information: " + error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(results);
    // Return the provider's information as a JSON response
    if (results.length > 0) {
      res.json({ provider: results[0] }); // Assuming you expect one result or adjust as needed
    } else {
      res.status(404).json({ error: "Provider not found" });
    }
  });
});

// Start SeekerHistory //

//update reservation status (Cancel Reservation)
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

// Show Reservation
router.get("/reservation/:status", jwtValidate, (req, res) => {
  const seeker_id = req.user.seeker_id;
  const { status } = req.params;
  console.log(seeker_id);

  pool.query(
    "SELECT r.*, s.seeker_address AS seeker_address, p.provider_name, sv.service_cost, sv.service_title " +
      "FROM reservation r " +
      "LEFT JOIN seeker s ON r.seeker_id = s.seeker_id " +
      "LEFT JOIN service sv ON r.service_id = sv.service_id " +
      "LEFT JOIN provider p ON r.provider_id = p.provider_id " +
      "WHERE r.seeker_id = ? AND r.status = ?",
    [seeker_id, status],
    (err, results, fields) => {
      console.log(results);
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});

// End SeekerHistory //

// Show Booking Detail //
router.get("/bookingDetails/:service_id", jwtValidate, (req, res) => {
  // Check if the user is authenticated and authorized
  const userId = req.user.seeker_id;
  const { service_id } = req.params;

  // Fetch the provider's information including services
  const sql =
    "SELECT s.*, p.provider_name, p.provider_id " +
    "FROM service s " +
    "JOIN provideservice ps ON ps.service_id = s.service_id " +
    "JOIN provider p ON ps.provider_id = p.provider_id " +
    "WHERE s.service_id = ?";

  pool.query(sql, [service_id], (error, results) => {
    if (error) {
      console.error("Error fetching provider information: " + error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(results);
    // Return the provider's information as a JSON response
    if (results.length > 0) {
      res.json({ provider: results[0] }); // Assuming you expect one result or adjust as needed
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  });
});

router.post("/makeReservation", jwtValidate, (req, res) => {
  // Check if the user is authenticated and authorized
  const seekerId = req.user.seeker_id;
  const { provider_id, service_id, reservation_time, reservation_date } =
    req.body;

  // Insert reservation into the reservation table
  const sql =
    "INSERT INTO reservation (seeker_id, provider_id, service_id, reservation_time, reservation_date, status) VALUES (?, ?, ?, ?, ?, ?)";

  const values = [
    seekerId,
    provider_id,
    service_id,
    reservation_time,
    reservation_date,
    "Processing",
  ];

  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error("Error making reservation:", error);
      res
        .status(500)
        .json({ error: "Failed to make a reservation. Please try again." });
      return;
    }

    console.log("Reservation made successfully. Result:", results);

    // Return a success message as a JSON response
    res.json({ message: "Reservation made successfully" });
  });
});

// Show Reservation without considering status (SeekerPending)
router.get("/reservation", jwtValidate, (req, res) => {
  const seeker_id = req.user.seeker_id;

  pool.query(
    "SELECT r.*, s.seeker_address AS seeker_address FROM reservation r " +
      "LEFT JOIN seeker s ON r.seeker_id = s.seeker_id " +
      "WHERE r.seeker_id = ? " +
      "ORDER BY r.reservation_id DESC", // Order by reservation_id in descending order
    [seeker_id],
    (err, results, fields) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Query results:", results);
        res.json(results);
      }
    }
  );
});

// Update reservation status
router.patch("/status/updateStatus", (req, res) => {
  const rid = req.body.reservation_id;
  const newStatus = req.body.new_status; // Change the field name to new_status

  try {
    pool.query(
      "UPDATE reservation SET status = ? WHERE reservation_id = ?",
      [newStatus, rid],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json({ message: "The reservation is completed!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// Update Reservation Status (SeekerConfirm)
router.put(
  "/updateReservationStatus/:reservationId",
  jwtValidate,
  (req, res) => {
    const seekerId = req.user.seeker_id;
    const reservationId = req.params.reservationId;
    const newStatus = "Processing"; // You can replace this with the desired status

    // Update the status in the reservation table
    const sql =
      "UPDATE reservation SET status = ? WHERE reservation_id = ? AND seeker_id = ?";

    const values = [newStatus, reservationId, seekerId];

    pool.query(sql, values, (error, results) => {
      if (error) {
        console.error("Error updating reservation status: " + error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Check if the reservation was found and updated
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Reservation not found" });
      } else {
        // Return a success message as a JSON response
        res.json({ message: "Reservation status updated successfully" });
      }
    });
  }
);

//Show SeekerHistoryDetails
router.get(
  "/bookingHistoryDetails/:reservation_id",
  jwtValidate,
  (req, res) => {
    const { reservation_id } = req.params;
    pool.query(
      "SELECT reservation.reservation_id, reservation.reservation_date, reservation.reservation_time, seeker.seeker_address AS seeker_location, provider.provider_name AS provider_name " +
        "FROM reservation " +
        "JOIN provider ON reservation.provider_id = provider.provider_id " +
        "JOIN seeker ON reservation.seeker_id = seeker.seeker_id " +
        "WHERE reservation.reservation_id = ?",
      [reservation_id],
      (queryError, results) => {
        if (queryError) {
          console.error("Database query error:", queryError);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results && results.length > 0) {
          req.user = results[0]; // Store the user (seeker) object in the request
          console.log(results);
          return res.json(results); // Send the results as a JSON response
        } else {
          return res
            .status(403)
            .json({ message: "User not found for the provided token." });
        }
      }
    );
  }
);

//Filter Category
router.get("/filter-category/:category_title", jwtValidate, (req, res) => {
  const seeker_id = req.user.seeker_id;
  const { category_title } = req.params;

  if (category_title === "All") {
    // If category_title is "All", execute a different query
    pool.query(
      "SELECT DISTINCT s.* " +
        "FROM service s " +
        "WHERE NOT EXISTS (" +
        "    SELECT 1 " +
        "    FROM reservation r " +
        "    WHERE r.service_id = s.service_id " +
        "    AND r.status = 'Processing'" +
        ")",
      (err, results, fields) => {
        handleDatabaseResponse(err, results, res);
      }
    );
  } else {
    // If category_title is not "All", execute the original query
    pool.query(
      "SELECT DISTINCT s.* " +
        "FROM service s " +
        "JOIN category c ON s.category_id = c.category_id " +
        "WHERE c.category_title = ? " +
        "AND NOT EXISTS (" +
        "    SELECT 1 " +
        "    FROM reservation r " +
        "    WHERE r.service_id = s.service_id " +
        "    AND r.status = 'Processing'" +
        ")",
      [category_title],
      (err, results, fields) => {
        handleDatabaseResponse(err, results, res);
      }
    );
  }
});

// Helper function to handle database query response
function handleDatabaseResponse(err, results, res) {
  if (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } else {
    res.json(results);
  }
}

// SeekerSearch
const mysql = require("mysql2/promise");

router.get("/searchService", async (req, res) => {
  const searchQuery = req.query.searchText;

  try {
    // Create a connection to the database
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "servicex",
      port: "3306",
    });

    const [results] = await connection.execute(
      `
      SELECT
          ps.service_id,
          s.service_title,
          s.service_description,
          s.service_cost,
          c.category_title,
          p.provider_name,
          p.provider_phone,
          p.provider_address
      FROM
          provideservice ps
      JOIN
          service s ON ps.service_id = s.service_id
      JOIN
          category c ON s.category_id = c.category_id
      JOIN
          provider p ON ps.provider_id = p.provider_id
      WHERE
          LOWER(s.service_title) LIKE LOWER(?)
          OR LOWER(s.service_description) LIKE LOWER(?)
      `,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );

    // Close the connection after executing the query
    await connection.end();

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
