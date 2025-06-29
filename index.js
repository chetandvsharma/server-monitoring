const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

// Decide what kind of response to send
function randomScenario() {
  const roll = Math.random();
  if (roll < 0.25) return "FAST_SUCCESS"; // < 25% fast success
  if (roll < 0.5) return "SLOW_SUCCESS"; // < 25% slow success (2‑5 s)
  if (roll < 0.75) return "DB_ERROR"; // < 25% simulated DB failure
  return "INTERNAL_ERROR"; // remainder → generic 500 error
}
app.get("/", (req, res) => res.send("Hello from Sirius Black"));

app.get("/slow", (req, res) => {
  const scenario = randomScenario();

  switch (scenario) {
    case "FAST_SUCCESS":
      // Respond almost instantly
      return res.json({
        status: "ok",
        scenario,
        message: "Responded in milliseconds 🎉",
      });

    case "SLOW_SUCCESS": {
      // Respond after a random delay between 2 000–5 000 ms
      const delay = 2000 + Math.floor(Math.random() * 3000);
      return setTimeout(() => {
        res.json({
          status: "ok",
          scenario,
          delay,
          message: `Responded after ${delay} ms 🐢`,
        });
      }, delay);
    }

    case "DB_ERROR":
      // Simulate a database connection failure
      return setTimeout(() => {
        res.status(500).json({
          status: "error",
          scenario,
          message: "Failed to connect to the database ❌",
        });
      }, 100);

    case "INTERNAL_ERROR":
    default:
      // Generic 500 error
      return setTimeout(() => {
        res.status(500).json({
          status: "error",
          scenario,
          message: "Internal Server Error 💥",
        });
      }, 100);
  }
});

app.get("/slow", (req, res) => {
  const scenario = randomScenario();

  switch (scenario) {
    case "FAST_SUCCESS":
      // Respond almost instantly
      return res.json({
        status: "ok",
        scenario,
        message: "Responded in milliseconds 🎉",
      });

    case "SLOW_SUCCESS": {
      // Respond after a random delay between 2 000–5 000 ms
      const delay = 2000 + Math.floor(Math.random() * 3000);
      return setTimeout(() => {
        res.json({
          status: "ok",
          scenario,
          delay,
          message: `Responded after ${delay} ms 🐢`,
        });
      }, delay);
    }

    case "DB_ERROR":
      // Simulate a database connection failure
      return setTimeout(() => {
        res.status(500).json({
          status: "error",
          scenario,
          message: "Failed to connect to the database ❌",
        });
      }, 100);

    case "INTERNAL_ERROR":
    default:
      // Generic 500 error
      return setTimeout(() => {
        res.status(500).json({
          status: "error",
          scenario,
          message: "Internal Server Error 💥",
        });
      }, 100);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
