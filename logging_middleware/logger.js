require("dotenv").config({ path: "../.env" });

const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

const logger = async (req, res, next) => {
  const token = process.env.TOKEN?.trim();

  console.log("LOGGER TOKEN:", token);

  try {
    await axios.post(
      LOG_API,
      {
        stack: "backend",
        level: "info",
        package: "route",
        message: `${req.method} ${req.url}`
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (err) {
    console.log("❌ LOG ERROR:", err.response?.data || err.message);
  }

  next();
};

module.exports = logger;