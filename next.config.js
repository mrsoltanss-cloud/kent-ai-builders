const path = require("path");

module.exports = {
  async rewrites(){ return [{ source:"/quote/thanks", destination:"/quote/success" }, { source:"/thanks", destination:"/quote/success" }]; },
  // moved out of `experimental` in Next 15
  outputFileTracingRoot: path.join(__dirname),

  // keep other settings here if you have them
};
