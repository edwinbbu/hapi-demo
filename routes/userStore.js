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

userStore.validateUser = async (email, password) => {
  let user = userStore.users[email];
  console.log("user:", user);
  if (!user) {
    return { error: Boom.notFound("User does not exist.") };
  }
  let isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { error: Boom.unauthorized("Password does not match") };
  } else {
    return { user: user };
  }
};

module.exports = { userStore };
