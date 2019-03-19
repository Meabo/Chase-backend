const firebase = require("firebase");
firebase.initializeApp();

const AuthGateway = {
  SignUp: (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
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
      .signInWithEmailAndPassword(email, password)
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
