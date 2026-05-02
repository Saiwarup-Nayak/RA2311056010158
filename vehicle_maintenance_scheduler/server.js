require("dotenv").config({ path: "../.env" }); // ✅ FIXED PATH

const express = require("express");
const axios = require("axios");
const knapsack = require("./knapsack");
const logger = require("../logging_middleware/logger");

const app = express();
app.use(express.json());

app.use(logger);

const PORT = 3000;

const DEPOT_API = "http://20.207.122.201/evaluation-service/depots";
const VEHICLE_API = "http://20.207.122.201/evaluation-service/vehicles";

app.get("/schedule", async (req, res) => {
  try {
    const token = process.env.TOKEN?.trim();

    console.log("SERVER TOKEN:", token);

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const depotRes = await axios.get(DEPOT_API, { headers });
    const vehicleRes = await axios.get(VEHICLE_API, { headers });

    const depots = depotRes.data.depots;
    const vehicles = vehicleRes.data.vehicles;

    const maxHours = depots[0].MechanicHours;

    const result = knapsack(vehicles, maxHours);

    res.json({
      source: "LIVE API",
      maxHours,
      totalImpact: result.totalImpact,
      selectedTasks: result.selectedTasks
    });

  } catch (error) {
    console.log(" API ERROR:", error.response?.data || error.message);

    const depots = [{ MechanicHours: 10 }];

    const vehicles = [
      { TaskID: "1", Duration: 1, Impact: 5 },
      { TaskID: "2", Duration: 6, Impact: 2 },
      { TaskID: "3", Duration: 5, Impact: 9 },
      { TaskID: "4", Duration: 2, Impact: 7 }
    ];

    const result = knapsack(vehicles, depots[0].MechanicHours);

    res.json({
      source: "FALLBACK",
      maxHours: depots[0].MechanicHours,
      totalImpact: result.totalImpact,
      selectedTasks: result.selectedTasks
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send(" Vehicle Maintenance Scheduler API is running");
});