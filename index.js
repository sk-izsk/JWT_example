const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (_, res) => {
  res.json({
    message: "Welcome to the API"
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    return err
      ? res.sendStatus(403)
      : res.json({
          message: "Post created...",
          authData
        });
  });
});

app.post("/api/login", (_, res) => {
  // Mock Payload
  const user = {
    id: 2,
    username: "iZsk",
    email: "izsk@outlook.com"
  };

  jwt.sign(
    { user },
    "secretkey",
    // { algorithm: "RS256" },
    { expiresIn: "30s" },
    (_, token) => {
      res.json({
        token
      });
    }
  );
});

app.listen(8000, () => console.log("Server started on port 8000"));
