const bcrypt = require("bcrypt");
const Boom = require("boom");
var userStore = {};

userStore.users = {};

userStore.initialize = function() {
  userStore.createUser("Edwin", "edwinbbu@gmail.com", "password");
};

userStore.createUser = async (name, email, password) => {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  let user = {
    name: name,
    email: email,
    passwordHash: hashedPassword
  };
  if (userStore.users[email]) {
    return Boom.conflict("Email already exists.Please log in");
  } else {
    userStore.users[email] = user;
    return;
  }
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
