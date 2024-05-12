const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle scraping logic
app.post("/scrape", async (req, res) => {
  try {
    return await scrapeLogic(req, res);
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


