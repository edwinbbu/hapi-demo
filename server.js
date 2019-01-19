const Hapi = require("hapi");
const Inert = require("inert");
const Handlebars = require("handlebars");
const Vision = require("vision");

// Create a server with a host and port
const server = Hapi.server({
  host: "localhost",
  port: 8000
});

// Start the server
const start = async function() {
  try {
    await server.register([
      Inert.plugin,
      Vision.plugin,
      {
        plugin: require("hapi-auth-cookie")
      }
    ]);

    server.auth.strategy("session", "cookie", {
      password: "$2b$10$elvwU5GPclitQgrXHRHJamnBIS0my8tdManxib4hY/ZNm9UUA52eC",
      redirectTo: "/login",
      isSecure: false
    });
    server.auth.default("session");
    // Initializing handlebars
    server.views({
      engines: { html: Handlebars },
      relativeTo: __dirname,
      path: "./templates"
    });

    server.ext("onRequest", (request, h) => {
      console.log("Request received:", request.path);
      return h.continue;
    });

    server.ext("onPreResponse", function(request, h) {
      if (request.response.isBoom) {
        return h.view("error", request.response);
      }
      return h.continue;
    });

    //All routes
    var routes = require("./routes");
    server.route(routes);

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
};

start();
