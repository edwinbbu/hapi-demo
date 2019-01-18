const fs = require("fs");

function loadCard() {
  let file = fs.readFileSync("./cards.json");
  let json = JSON.parse(file.toString());
  return json;
}

function mapImages() {
  let json = fs.readdirSync("./public/images/cards");
  return json;
}

module.exports = {
  loadCard,
  mapImages
};
