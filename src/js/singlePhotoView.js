import { loadHeaderFooter, getParam } from "./utils.mjs";
import { fetchPhotoDetails, updatePhotoDetails } from "./SinglePhotoView.mjs";

loadHeaderFooter();

const photoId = getParam("id");
const rover = getParam("rover");
const sol = getParam("sol");

async function initSinglePhotoView() {
  const photo = await fetchPhotoDetails(photoId, rover, sol);
  if (photo) {
    updatePhotoDetails(photo);
  } else {
    document.getElementById("photo-details").innerHTML = "<p>Photo details not available.</p>";
  }
}

initSinglePhotoView();