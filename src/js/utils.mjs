export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function convertToJson(res) {
  console.log('Response status in convertToJson:', res.status);
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export function convertToText(res) {
  if (res.ok) {
    return res.text();
  } else {
    throw new Error("Bad Response");
  }
}

export async function fetchMarsImages(rover, params) {
  const apiBaseUrl = process.env.NODE_ENV === 'production'
    ? 'https://red-planet-explorers.onrender.com' 
    : 'http://localhost:5000';

  const apiKey = import.meta.env.VITE_NASA_API_KEY;  
  const url = `${apiBaseUrl}/api/rovers/${rover}/photos?${new URLSearchParams({
    ...params,
    api_key: apiKey
  })}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await convertToJson(response);
    return data;

  } catch (error) {
    console.error('Error fetching Mars images:', error);
    throw error;
  }
}

export async function loadHeaderFooter() {
  const header = await loadTemplate("header");
  const footer = await loadTemplate("footer");
  const headerElement = qs("#main-header");
  const footerElement = qs("#main-footer");
  renderWithTemplate((data) => data, headerElement, header);
  renderWithTemplate((data) => data, footerElement, footer);
}

async function loadTemplate(name) {
  const path = `../partials/${name}.html`;
  const html = await fetch(path).then(convertToText);
  return html;
}

export function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  position = "afterbegin",
  clear = false,
  callback = null
) {
  const htmlString = templateFn(data);

  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(position, htmlString);

  if (callback) {
    callback(data);
  }
}

export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener("click", callback);
  }
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function addFavorite(photo) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const photoData = {
    id: photo.id,
    img_src: photo.img_src,
    rover: photo.rover,
    camera: photo.camera,
    earth_date: photo.earth_date,
    sol: photo.sol
  };

  if (!favorites.some(fav => fav.id === photo.id)) {
    favorites.push(photoData);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export function removeFavorite(photoId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(photo => photo.id !== photoId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function isFavorited(photoId) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.some(photo => photo.id === photoId);
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}