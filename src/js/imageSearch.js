import { loadHeaderFooter, getParam } from "./utils.mjs";
import { updateRoverDetails, roverImages } from "./Search.mjs";

loadHeaderFooter();

const rover = getParam("rover");

const roverNameElement = document.getElementById("rover-name");
const roverImageElement = document.getElementById("rover-image");

roverNameElement.textContent = rover.charAt(0).toUpperCase() + rover.slice(1);
roverImageElement.src = roverImages[rover];

updateRoverDetails(rover);

document.querySelector("#search-photos-btn").addEventListener("click", () => {
  const sol = document.querySelector("#sol").value;
  const earthDate = document.querySelector("#earth_date").value;
  const camera = document.querySelector("#camera").value;

  let galleryUrl = `../image-gallery/index.html?rover=${rover}`;

  if (sol && sol !== "null") {
    galleryUrl += `&sol=${sol}`;
  } else if (earthDate) {
    galleryUrl += `&earth_date=${earthDate}`;
  }

  if (camera) {
    galleryUrl += `&camera=${camera}`;
  }

  window.location.href = galleryUrl;
});