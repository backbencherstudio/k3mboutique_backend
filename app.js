const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const route = require("./modules/users/users.routes");
const adminroute = require("./modules/admin/admin.route");
const User = require("./modules/users/users.models");

const nodemailer = require("nodemailer");
const support = require("./modules/supports/support.route");



const crypto = require("crypto");
const axios = require("axios");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');

const path = require("path");



const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "http://10.0.2.2:*",
      "https://c567-137-59-180-113.ngrok-free.app",
      "https://symphonious-pastelito-e4abb5.netlify.app"

    ],
    credentials: true, // Important for cookies
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());





app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 3600000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

app.set('trust proxy', 1);


app.use((req, res, next) => {
  if (req.path === "/webhook" || req.path === "/api/payments/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/api/users", route);
app.use("/api/admin", adminroute);


app.use("/api/support", support);


// optional----------------------


app.get("/success", async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    if (!sessionId) {
      return res.status(400).send({ message: "Session ID is required" });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).send({ message: "Session not found" });
    }

    res.status(200).send({ message: "Payment successful", session });
  } catch (error) {
    console.error("Error retrieving session:", error.message);
    res
      .status(500)
      .send({ message: `500! Something broken: ${error.message}` });
  }
});







app.use((err, req, res, next) => {
  res.status(500).json({
    message: "500! Something broken",
  });
});



module.exports = app;
