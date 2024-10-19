const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://red-planet-explorers.onrender.com", 
  "http://localhost:5173"  
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/rovers/:rover/photos", async (req, res) => {
  const { rover } = req.params;
  const { sol, earth_date, camera } = req.query;
  const apiKey = process.env.VITE_NASA_API_KEY;

  const fetch = (await import("node-fetch")).default;

  let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?`;

  if (sol) {
    url += `sol=${sol}&`;
  } else if (earth_date) {
    url += `earth_date=${earth_date}&`;
  }

  if (camera) {
    url += `camera=${camera}&`;
  }

  url += `api_key=${apiKey}`;

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});