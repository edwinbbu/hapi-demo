const Hapi = require("hapi");
const Inert = require("inert");
const Handlebars = require("handlebars");
const Vision = require("vision");

// Create a server with a host and port
const server = Hapi.server({
  host: "localhost",
  port: 8000
});

server.ext("onRequest", (request, h) => {
  console.log("Request received:", request.path);
  return h.continue;
});

// Start the server
const start = async function() {
  try {

    await server.register([Inert.plugin, Vision.plugin]);
    // Initializing handlebars
    server.views({
      engines: { html: Handlebars },
      relativeTo: __dirname,
      path: "./templates"
    });

    // Serving Static files
    server.route({
      method: "GET",
      path: "/assets/{path*}",
      handler: {
        directory: {
          path: "./public",
          listing: false
        }
      },
      config: {
        state: {
          parse: true,
          failAction: "log"
        }
      }
    });

    //All routes
    var routes = require('./routes');
    server.route(routes);

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
};

start();
