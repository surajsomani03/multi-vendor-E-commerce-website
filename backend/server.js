const app = require("./app");
const connectDatabase = require("./db/Database");
const cors = require("cors");

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

// Add cors configuration before other middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://dp-frontend-rosy.vercel.app',
    'https://dp-frontend-rosy.vercel.app/',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-custom-header']
}));

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

app.get('/api/v2/health', (req, res) => {
  res.json({ status: 'ok' });
});
