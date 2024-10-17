const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/api/rovers/:rover/photos", async (req, res) => {
  const { rover } = req.params;
  const { sol, earth_date, camera } = req.query;
  const apiKey = process.env.VITE_NASA_API_KEY;  

  const fetch = (await import("node-fetch")).default;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol || ""}&earth_date=${earth_date || ""}&camera=${camera || ""}&api_key=${apiKey}`;
  console.log(`Fetching photos for ${rover}: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NASA API returned an error: ${response.status} - ${errorText}`);
      throw new Error(`NASA API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching photos for ${rover}:`, error.message);
    res.status(500).send({ error: "Failed to fetch rover photos from NASA API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});