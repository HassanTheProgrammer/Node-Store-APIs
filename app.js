require("dotenv").config();
require("express-async-errors");

const express = require("express");
const errorMiddleware = require("./middlewares/error-handler.middleware");
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/Products.route");

const app = express();

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>products route</a>");
});

app.use("/api/v1/products", productsRouter);

// products route
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 7860;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`server is listening port ${port}`));
  } catch (error) {
    console.log(error.message);
  }
};

start();
