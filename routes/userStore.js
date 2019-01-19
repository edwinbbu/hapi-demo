const bcrypt = require("bcrypt");
const Boom = require("boom");
var userStore = {};

userStore.users = {};

userStore.initialize = function() {
  userStore.createUser("Edwin", "edwinbbu@gmail.com", "password");
};

userStore.createUser = (name, email, password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      let user = {
        name: name,
        email: email,
        passwordHash: hash
      };
      if (userStore.users[email]) {
        callback(Boom.conflict("Email already exists.Please log in"));
      } else {
        userStore.users[email] = user;
        if (callback) callback();
      }
    });
  });
};

userStore.validateUser = (email, password, callback) => {
  let user = userStore.users[email];
  console.log("user:", user);
  if (!user) {
    return callback(Boom.notFound("User does not exist."));
  }
  bcrypt.compare(password, user.passwordHash, (err, isValid) => {
    if (!isValid) {
      callback(Boom.unauthorized("Password does not match"));
    } else {
      callback(null, user);
    }
  });
};

module.exports = { userStore };
