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

async function loginHandler(request, h) {
  console.log(request.payload);
  let result = await userStore.validateUser(
    request.payload.email,
    request.payload.password
  );
  console.log("r:", result);
  if (result.error) {
    throw result.error;
  }
  if (result.user) {
    console.log("inside:", result.user);
    request.cookieAuth.set(result.user);
    // console.log("h:", h);
    // return h.file("./templates/login.html");
    return h.redirect("/cards");
  }
}
function registerHandler(request, h) {}
