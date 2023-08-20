import bcrypt from "bcrypt";
import {
  generateCookie,
  generateToken,
  decodeJwtToken,
  hashPassword,
} from "../utils/utils.js";
import UserTokenDto from "../dto/userTokenDTO.js";
import { emailService } from "./index.js";
import {
  AlreadyUsedPasswordError,
  InvalidUserFieldError,
  InvalidUserIdError,
  NotRegisteredUserEmailError,
} from "./error/UserError.js";

export default class UserService {
  constructor(repository) {
    this.repository = repository;
  }
  async changeUserRole(id) {
    const user = await this.validateIdAndUserExistence(id);
    const currentRole = user.role;
    let newRole;
    if (currentRole == "user") {
      newRole = "premium";
    } else if (currentRole == "premium") {
      newRole = "user";
    } else {
      console.log("bad admin");
      /* lanzamos un error porque podria ser un admin queriendo evadir la afip */
    }
    await this.repository.updateUserRole(id, newRole);
  }

  async getUserByEmail(email) {
    const user = await this.repository.getUserByEmail(email);
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
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotRegisteredUserEmailError(
        `No account is registered with the email: ${email} `
      );
    }
    const token = generateToken({ userEmail: email }, "1h");
    const link = `http://127.0.0.1:8080/newpassword/${token}`;
    emailService.sendPasswordRestorationEmail(email, link);
  }

  async createNewUserPassword(token, password) {
    try {
      const decodedToken = decodeJwtToken(token, process.env.JWT_KEY);
      const email = decodedToken.userEmail;
      const user = await this.getUserByEmail(email);
      const isTheSamePassword = await bcrypt.compare(password, user.password);
      if (isTheSamePassword) {
        throw new AlreadyUsedPasswordError(
          "the new password can not be one used previously"
        );
      }
      const newPassword = await hashPassword(password);
      user.password = newPassword;
      await this.repository.updateUser(email, user);
    } catch (error) {
      throw error;
    }
  }
  verifyToken(token) {
    const decodedToken = decodeJwtToken(token, process.env.JWT_KEY);
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
  async validateIdAndUserExistence(id) {
    const isValidId = await this.repository.isIdValid(id);
    if (!isValidId) {
      throw new InvalidUserIdError(`the user id ${id} is not valid`);
    }
    const user = await this.repository.getUserById(id);
    /* cambiar metodo en repositorio para checkear por la existencia y no recuperarlo de la DB */
    if (!user) {
      throw new InvalidUserIdError(`the user with id ${id} does not exists`);
    }
    return user;
  }
}
