const express = require('express');
const cors = require('cors');
const app = express();
const connectDatabase = require("./db/Database");

// CORS configuration for Vercel
app.use(cors({
    origin: ['https://dp-frontend-neocreatyve-gmailcoms-projects.vercel.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// connect db
connectDatabase();

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}`
  );
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});

// Update your exports for Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(5000, () => console.log('Server running on port 5000'));
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://dp-frontend-neocreatyve-gmailcoms-projects.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

module.exports = app;
