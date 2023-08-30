import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
} from "../../utils/http_responses.js";

export class InvalidUserFieldError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidUserFieldError";
    this.status = BAD_REQUEST;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class ExistentUserEmailError extends Error {
  constructor(message) {
    super(message);
    this.name = "ExistentUserEmailError";
    this.status = CONFLICT;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class NotRegisteredUserEmailError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotRegisteredUserEmailError";
    this.status = NOT_FOUND;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class AlreadyUsedPasswordError extends Error {
  constructor(message) {
    super(message);
    this.name = "AlreadyUsedPasswordError";
    this.status = BAD_REQUEST;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class InvalidUserIdError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidUserIdError";
    this.status = BAD_REQUEST;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class ForbiddenUserError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenUserError";
    this.status = FORBIDDEN;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}