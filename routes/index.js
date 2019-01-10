const uuid = require("uuid");
const fs = require("fs");
var cards = loadCard();

module.exports = [
  //index page
  {
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
  },

  //new card route
  {
    method: ["GET", "POST"],
    path: "/cards/new",
    handler: newCardHandler,
    config: {
      state: {
        parse: true,
        failAction: "log"
      }
    }
  },
  {
    method: "GET",
    path: "/cards",
    handler: function(request, h) {
      return h.view("cards", {cards:cards});
    },
    config: {
      state: {
        parse: true,
        failAction: "log"
      }
    }
  },

  //Delete Card
  {
    path: "/cards/{id}",
    method: "DELETE",
    handler: deleteCardHandler
  }
];

function newCardHandler(request, h) {
  if (request.method === "get") {
    return h.file("./templates/new.html");
  } else {
    console.log("inside post");
    var card = {
      name: request.payload.name,
      recipient_email: request.payload.recipient_email,
      sender_name: request.payload.sender_name,
      sender_email: request.payload.sender_email,
      card_image: request.payload.card_image
    };
    saveCard(card);
    console.log(cards);
    return h.redirect("/cards");
  }
}

function saveCard(card) {
  let id = uuid.v1();
  card.id = id;
  cards[id] = card;
}

function deleteCardHandler(request, h) {
  console.log("inside delete handler");
  delete cards[request.params.id];
  var response = h.response("Successfully Deleted item");
  return response;
}

function loadCard() {
  let file = fs.readFileSync("./cards.json");
  let json = JSON.parse(file.toString());
  return json;
}
