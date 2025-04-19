const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "imk1d3", // <-- ✅ projectId từ Cypress Cloud
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: false,
  },
});
