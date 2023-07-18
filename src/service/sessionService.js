export default class SessionService {
  constructor(repository) {
    this.repository = repository;
  }

  async getUser(email) {
    const user = await this.repository.getUser(email);
    return user ? user : null;
  }
  async createUser(user) {
    const createdUser = await this.repository.createUser(user);
    return user;
  }
}
