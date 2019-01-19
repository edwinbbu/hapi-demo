const { userStore } = require("./userStore");
userStore.initialize();

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
  },
  {
    method: "POST",
    path: "/login",
    handler: loginHandler,
    config: configuration
  },
  {
    method: "GET",
    path: "/register",
    handler: function(request, h) {
      return h.file("./templates/register.html");
    },
    config: configuration
  },
  {
    method: "POST",
    path: "/register",
    handler: registerHandler,
    config: configuration
  },
  {
    path: "/logout",
    method: "GET",
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
    config: configuration
  }
];

function loginHandler(request, h) {
  console.log(request.payload);
  userStore.validateUser(
    request.payload.email,
    request.payload.password,
    (err, user) => {
      if (user) {
        console.log("inside:", user);
        request.cookieAuth.set(user);
        return h.redirect("/cards");
      }
    }
  );
}
function registerHandler(request, h) {}
