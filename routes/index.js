var card = require("./card");

var configuration = {
  state: {
    parse: true,
    failAction: "log"
  }
};

// Serving Static files
var indexRouter = [
  {
    method: "GET",
    path: "/assets/{path*}",
    handler: {
      directory: {
        path: "./public",
        listing: false
      }
    },
    config: configuration
  },
  //index page
  {
    method: "GET",
    path: "/",
    handler: function(request, h) {
      return h.file("./templates/index.html");
    },
    config: configuration
  }
];

module.exports = indexRouter.concat(card);
