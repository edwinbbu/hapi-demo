const uuid = require("uuid");
const Joi = require("joi");
const Boom = require("boom");
const utility = require("./utility");

var cards = utility.loadCard();

var configuration = {
  state: {
    parse: true,
    failAction: "log"
  }
};

var cardSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  recipient_email: Joi.string()
    .email()
    .required(),
  sender_name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  sender_email: Joi.string()
    .email()
    .required(),
  card_image: Joi.string()
    .regex(/.+\.(jpg|bmp|png|gif)\b/)
    .required()
});

module.exports = [
  //new card route
  {
    method: "GET",
    path: "/cards/new",
    handler: function(request, h) {
      return h.view("new", { card_images: utility.mapImages() });
    },
    options: {
      state: {
        parse: true,
        failAction: "log"
      }
    }
  },
  {
    method: "POST",
    path: "/cards/new",
    handler: newCardHandler,
    options: {
      state: {
        parse: true,
        failAction: "log"
      },
      validate: {
        payload: cardSchema,
        failAction: handleError
      }
    }
  },

  {
    method: "GET",
    path: "/cards",
    handler: function(request, h) {
      console.log("test");
      return h.view("cards", { cards: cards });
    },
    config: configuration
  },

  //Delete Card
  {
    path: "/cards/{id}",
    method: "DELETE",
    handler: deleteCardHandler,
    config: configuration
  }
];

function newCardHandler(request, h) {
  console.log("inside post");
  let card = {
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

function deleteCardHandler(request, h) {
  console.log("inside delete handler");
  delete cards[request.params.id];
  let response = h.response("Successfully Deleted item");
  return response;
}

function handleError(request, h, err) {
  console.log("err:", err.details);
  throw Boom.badRequest(err.details[0].message);
}

function saveCard(card) {
  let id = uuid.v1();
  card.id = id;
  cards[id] = card;
}
