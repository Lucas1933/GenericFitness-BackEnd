import { generateCookie, generateToken } from "../utils/utils.js";
import UserTokenDto from "../dto/userTokenDTO.js";
import { InvalidUserFieldError } from "./error/UserError.js";
export default class SessionService {
  constructor(repository) {
    this.repository = repository;
  }

  async getUser(email) {
    const user = await this.repository.getUser(email);
    return user ? user : null;
  }
  async createUser(user) {
    this.validateUserFields(user);
    const createdUser = await this.repository.createUser(user);
    return user;
  }
  /* se recomienda usar libreria de validaciones, estas custom son para practicar */
  validateUserFields({ firstName, lastName, email, password }) {
    if (!firstName || firstName.length == 0) {
      throw new InvalidUserFieldError(`user first name cannot be empty`);
    }
    if (!lastName || lastName.length == 0) {
      throw new InvalidUserFieldError(`user last name cannot be empty`);
    }
    if (!password || password.length == 0) {
      throw new InvalidUserFieldError(`user password cannot be empty`);
    }
    if (email && email.length != 0) {
      const isEmailValid = email.includes("@") && email.includes(".com");
      if (!isEmailValid) {
        throw new InvalidUserFieldError(`user email is not valid`);
      }
    } else {
      throw new InvalidUserFieldError(`user email cannot be empty`);
    }
  }
  generateTokenAndCookie(user, res) {
    const userToken = new UserTokenDto(user);
    const token = generateToken(userToken.plain());
    generateCookie(res, token);
  }
}
