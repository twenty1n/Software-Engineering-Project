// Importing necessary React hooks
import React, { createContext, useContext, useState } from 'react';

// Creating a new Context for the token
const TokenContext = createContext();

// Component to provide the token context to its children
export function TokenUser({ children }) {
  // State hook to store and set the token
  const [token, setToken] = useState(null);

  return (
    // Providing the token and setToken function to the context
    // Note: 'TokenContext.User' should be 'TokenContext.Provider'
    <TokenContext.User value={{ token, setToken }}>
      {children}
    </TokenContext.User>
  );
}

// Custom hook to use the token context
export function useToken() {
  // Using the useContext hook to consume the token context
  const context = useContext(TokenContext);

  // Throwing an error if the hook is used outside of TokenUser provider
  if (!context) {
    throw new Error('useToken must be used within a User');
  }

  // Returning the context which contains the token and setToken
  return context;
}