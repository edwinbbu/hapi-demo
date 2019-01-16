const Hapi = require("hapi");
const Inert = require("inert");
const Handlebars = require("handlebars");
const Vision = require("vision");

// Create a server with a host and port
const server = Hapi.server({
  host: "localhost",
  port: 8000
});

const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    myConsoleReporter: [
      {
        module: "good-squeeze",
        name: "Squeeze",
        args: [{ log: "*", response: "*" }]
      },
      {
        module: "good-console"
      },
      "stdout"
    ],
    myFileReporter: [
      {
        module: "good-squeeze",
        name: "Squeeze",
        args: [{ ops: "*" }]
      },
      {
        module: "good-squeeze",
        name: "SafeJson"
      },
      {
        module: "good-file",
        args: ["./test/fixtures/awesome_log"]
      }
    ]
  }
};

// Start the server
const start = async function() {
  try {
    await server.register([
      Inert.plugin,
      Vision.plugin,
      {
        plugin: require("good"),
        options
      }
    ]);
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
