import { generateCookie, generateToken } from "../utils.js";
import UserTokenDto from "../dto/userTokenDTO.js";
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
  generateTokenAndCookie(user, res) {
    const userToken = new UserTokenDto(user);
    const token = generateToken(userToken.plain());
    generateCookie(res, token);
  }
}
