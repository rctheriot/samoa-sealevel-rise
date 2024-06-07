import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["**/*.jpg", "**/*.geojson"],
  base: "/island/dist",
});
