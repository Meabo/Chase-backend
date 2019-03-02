class User {
  constructor(email) {
    this.email = email;
    this.profile = {};
    this.player_profile = {};
  }
  getEmail() {
    return this.email;
  }
  createProfile(first_name, last_name, born_date) {
    this.profile.first_name = first_name;
    this.profile.last_name = last_name;
    this.profile.born_date = born_date;
  }

  createPlayerProfile(pseudo, avatarId, player_type) {
    this.player_profile.pseudo = pseudo;
    this.player_profile.avatar_id = avatarId;
    this.player_profile.player_type = player_type;
  }

  getUserProfile() {
    return this.profile;
  }

  getUserPlayerProfile() {
    return this.player_profile;
  }
}

module.exports = User;
