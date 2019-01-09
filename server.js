const Hapi = require("hapi");
const Inert = require("inert");
const uuid = require("uuid");
var cards = {}

// Create a server with a host and port
const server = Hapi.server({
  host: "localhost",
  port: 8000
});
server.ext("onRequest", (request, h) => {
  console.log("Request received:", request.path);
  return h.continue;
});

// Add the route
server.route({
  method: "GET",
  path: "/",
  handler: function(request, h) {
    return h.file("./templates/index.html");
  },
  config: {
    state: {
      parse: true,
      failAction: "log"
    }
  }
});

//new card route
server.route({
  method: ["GET", "POST"],
  path: "/cards/new",
  handler: newCardHandler,
  config: {
    state: {
      parse: true,
      failAction: "log"
    }
  }
});

//card route  
server.route({
  method: "GET",
  path: "/cards",
  handler: function(request, h) {
    return h.file("./templates/cards.html");
  },
  config: {
    state: {
      parse: true,
      failAction: "log"
    }
  }
})

// Start the server
const start = async function() {
  try {
    await server.register({
      plugin: Inert
    });

    //Serving Static files
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

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
};

start();

function newCardHandler(request, h){
  if (request.method === "get") {
    return h.file("./templates/new.html");
  } else {
    console.log("inside post");
    return h.redirect("/cards");
  }
}

function saveCard(card){
  let id = uuid.v1();
  card.id = id;
  cards[id] = card;
}