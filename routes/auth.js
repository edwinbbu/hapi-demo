var configuration = {
  auth: false,
  state: {
    parse: true,
    failAction: "log"
  }
};

module.exports = [
  {
    method: "GET",
    path: "/login",
    handler: function(request, h) {
      return h.file("./templates/login.html");
    },
    config: configuration
  }
];
