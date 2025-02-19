const express = require("express");
const connectDB = require("./db");
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/index");

const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "https://adda-with.netlify.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(routes);

app.get("/", (_req, res) => {
  res.status(200).send("Adda app server is running");
});

/* Server error handler */
app.use((err, _req, res, _next) => {
  const message = err.message ? err.message : "Server error occurred";
  const status = err.status ? err.status : 500;
  return res.status(status).json({ message });
});

connectDB(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.DB_PASS}@cluster0.phpiexj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
)
  .then(() => {
    console.log("Database connected"),
      app.listen(port, "0.0.0.0", () => {
        console.log(`Adda app listening on PORT: ${port}`);
      });
  })
  .catch((e) => {
    console.error(e);
  });

module.exports = app;
