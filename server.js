const express = require("express");
const connectDB = require("./db");
const port = 8080;
const cors = require("cors");
const routes = require("./routes/index");

const app = express();
app.use(express.json());
app.use(cors());
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

connectDB("mongodb://127.0.0.1:27017/adda")
  .then(() => {
    console.log("Database connected"),
      app.listen(port, () => {
        console.log(`Adda app listening on PORT: ${port}`);
      });
  })
  .catch((e) => {
    console.error(e);
  });
