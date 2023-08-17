import { generateCookie, generateToken } from "../utils/utils.js";
import UserTokenDto from "../dto/userTokenDTO.js";
import { emailService } from "./index.js";
import {
  InvalidUserFieldError,
  NotRegisteredUserEmailError,
} from "./error/UserError.js";
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
  async restoreUserPassword(email) {
    /* esto se tiene que refactorizar porque esta horrible */
    this.validateUserFields({
      firstName: "_ignore",
      lastName: "_ignore",
      email,
      password: "_ignore",
    });
    const user = await this.getUser(email);
    if (!user) {
      throw new NotRegisteredUserEmailError(
        `No account is registered with the email: ${email} `
      );
    }
    const token = generateToken({}, "10s");
    const link = `http://127.0.0.1:8080/newpassword/${token}`;
    emailService.sendPasswordRestorationEmail(email, link);
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
    const token = generateToken(userToken.plain(), "24h");
    generateCookie(res, token);
  }
}
