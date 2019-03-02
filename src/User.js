class User {
  constructor(pseudo_, email_) {
    this.pseudo = pseudo_;
    this.email_ = email_;
  }
  getEmail() {
    return this.email_;
  }
}

module.exports = User;
