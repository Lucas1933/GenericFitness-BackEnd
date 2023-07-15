export default class SessionService {
  constructor(repository) {
    this.repository = repository;
  }

  async getUser(email) {
    const user = await this.repository.getUser(email);
    return user ? user : null;
  }
  createUser(user) {
    const createdUser = this.repository.createUser(user);
    return user;
  }
}
