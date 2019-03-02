const firebase = require("firebase");
const config = require("../credentials/key.json");
firebase.initializeApp(config);

const AuthGateway = {
  SignUp: (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword("mehdi@multis.co", "password")
      .then(function(result) {
        return true;
      })
      .catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        return false;
        // ...
      });
  },
  SignIn: (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword("mehdi@multis.co", "password")
      .then(function(result) {
        return true;
      })
      .catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        return false;
        // ...
      });
  },
  SignOut: () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        return true;
      })
      .catch(function(error) {
        return false;
      });
  }
};

exports.AuthGateway = AuthGateway;
