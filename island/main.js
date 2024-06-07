import basemap from "./basemap.jpg";
import * as d3 from "d3";

import samoa2100 from "./layers/output-2100.geojson";
import samoa2090 from "./layers/output-2090.geojson";
import samoa2080 from "./layers/output-2080.geojson";
import samoa2070 from "./layers/output-2070.geojson";
import samoa2060 from "./layers/output-2060.geojson";
import samoa2050 from "./layers/output-2050.geojson";
import samoa2040 from "./layers/output-2040.geojson";
import samoa2030 from "./layers/output-2030.geojson";

const layerDict = {
  2030: samoa2030,
  2040: samoa2040,
  2050: samoa2050,
  2060: samoa2060,
  2070: samoa2070,
  2080: samoa2080,
  2090: samoa2090,
  2100: samoa2100,
};

const width = 1000;
const height = 1000;

let scale = 1;
let translateX = 0;
let translateY = 0;

const svg = d3
  .select("#map")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("width", width)
  .attr("height", height);

const americanSamoaLatLong = [-170.70790546534414, -14.319990404683866];

// Create a projection and path generator for the map
const projection = d3
  .geoMercator()
  .center(americanSamoaLatLong)
  .scale(1000000)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Define the bounding box for the image in latitude and longitude
const imageBounds = {
  topLeft: [-170.74455304334987, -14.293137270849233], // [longitude, latitude] for the top-left corner
  bottomRight: [-170.69228343385947, -14.35687703284298], // [longitude, latitude] for the bottom-right corner
};

// Convert the bounding box to pixel coordinates
const topLeftPx = projection(imageBounds.topLeft);
const bottomRightPx = projection(imageBounds.bottomRight);

// Calculate the width and height in pixels
const imageWidth = bottomRightPx[0] - topLeftPx[0];
const imageHeight = bottomRightPx[1] - topLeftPx[1];

// Append the image to the SVG
svg
  .append("image")
  .attr("xlink:href", basemap)
  .attr("x", topLeftPx[0])
  .attr("y", topLeftPx[1])
  .attr("width", imageWidth)
  .attr("height", imageHeight);

const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0, 280]);

function removeExistingGeojson() {
  console.log("removing existing geojson");
  svg.selectAll(".geojson-layer").remove();
}

function addGeojsonlayer(layer) {
  d3.json(layer).then((geojson) => {
    svg
      .selectAll(".geojson-layer")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("class", "geojson-layer")
      .attr("d", path)
      .attr("fill", "none")
      .attr("opacity", 0.4)
      .attr("stroke", (d) => {
        // parcels have a property called flood which is an interger from 0 to 300
        // Create a gradient color scale based on the flood value
        const flood = d.properties.flood;

        return colorScale(flood);
      });
  });
}

function updateTitle(year) {
  document.getElementById(
    "title"
  ).innerText = `Flood Risk in American Samoa in ${year}`;
}

svg.attr(
  "transform",
  `scale(${scale}) translate(${translateX}, ${translateY})`
);

// Sclae the svg and translate it to the correct position
function scaleAndTranslate() {
  svg.attr(
    "transform",
    `scale(${scale}) translate(${translateX}, ${translateY})`
  );
}

// Button Behavior for zooming in
document.getElementById("zoom-in").addEventListener("click", () => {
  scale += 0.01;
  scaleAndTranslate();
});
document.getElementById("zoom-out").addEventListener("click", () => {
  scale -= 0.01;
  scaleAndTranslate();
});

// Button Behavior for translating the map
document.getElementById("shift-up").addEventListener("click", () => {
  translateY -= 10;
  scaleAndTranslate();
});
document.getElementById("shift-down").addEventListener("click", () => {
  translateY += 10;
  scaleAndTranslate();
});
document.getElementById("shift-left").addEventListener("click", () => {
  translateX -= 10;
  scaleAndTranslate();
});
document.getElementById("shift-right").addEventListener("click", () => {
  translateX += 10;
  scaleAndTranslate();
});

// button behavior for selecting year
document.getElementById("select-hide").addEventListener("click", () => {
  removeExistingGeojson();
});

// button behavior for selecting year
document.getElementById("select-2100").addEventListener("click", () => {
  removeExistingGeojson();
  addGeojsonlayer(samoa2100);
  updateTitle(2100);
});
document.getElementById("select-2090").addEventListener("click", () => {
  removeExistingGeojson();
  addGeojsonlayer(samoa2090);
  updateTitle(2090);
});
document.getElementById("select-2080").addEventListener("click", () => {
  removeExistingGeojson();
  addGeojsonlayer(samoa2080);
  updateTitle(2080);
});
document.getElementById("select-2070").addEventListener("click", () => {
  removeExistingGeojson();
  addGeojsonlayer(samoa2070);
  updateTitle(2070);
});
document.getElementById("select-2060").addEventListener("click", () => {
  removeExistingGeojson();
  addGeojsonlayer(samoa2060);
  updateTitle(2060);
});
document.getElementById("select-2050").addEventListener("click", () => {
  removeExistingGeojson();
  addGeojsonlayer(samoa2050);
  updateTitle(2050);
});
document.getElementById("select-2040").addEventListener("click", () => {
  removeExistingGeojson();
  addGeojsonlayer(samoa2040);
  updateTitle(2040);
});
document.getElementById("select-2030").addEventListener("click", () => {
  removeExistingGeojson();
  addGeojsonlayer(samoa2030);
  updateTitle(2030);
});

// Function to cycle through the years
let year = 2030;
function cycleYear() {
  removeExistingGeojson();
  const layer = layerDict[year];
  addGeojsonlayer(layer);
  updateTitle(year);
  year += 10;
  if (year > 2100) {
    year = 2030;
  }
}

let interval = null;
document.getElementById("cycle").addEventListener("click", () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
    // Set inner text to "Cycle" when not cycling
    document.getElementById("cycle").innerText = "Cycle";
  } else {
    interval = setInterval(cycleYear, 3000);
    year = 2030;
    cycleYear();
    // Set inner text to "Stop" when cycling
    document.getElementById("cycle").innerText = "Stop";
  }
});
