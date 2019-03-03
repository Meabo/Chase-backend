class Repository {
  constructor() {
    this.repo = [];
  }

  add(single) {
    this.repo.add(single);
  }

  set(multiple) {
    this.repo = multiple;
  }

  getAll() {
    return this.repo;
  }
}
module.exports = Repository;
