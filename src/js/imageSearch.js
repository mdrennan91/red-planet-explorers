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
  const camera = document.querySelector("#camera").value;

  const galleryUrl = `../image-gallery/index.html?rover=${rover}&sol=${sol}&camera=${camera}`;
  window.location.href = galleryUrl;
});