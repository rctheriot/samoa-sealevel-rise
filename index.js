const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve static files for island and touchui
app.use("/island/dist", express.static(path.join(__dirname, "island/dist")));
app.use("/touchui/dist", express.static(path.join(__dirname, "touchui/dist")));

// Ensure that the correct index.html file is served when accessing the root paths
app.get("/island", (req, res) => {
  res.sendFile(path.join(__dirname, "island/dist/index.html"));
});

app.get("/touchui", (req, res) => {
  res.sendFile(path.join(__dirname, "touchui/dist/index.html"));
});

// Fallback to handle requests to static files directly
app.use(
  "/island/assets",
  express.static(path.join(__dirname, "island/dist/assets"))
);
app.use(
  "/touchui/assets",
  express.static(path.join(__dirname, "touchui/dist/assets"))
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
