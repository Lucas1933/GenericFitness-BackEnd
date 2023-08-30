import { BAD_REQUEST, NOT_FOUND } from "../../utils/http_responses.js";

export class InvalidCartIdError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCartIdError";
    this.status = BAD_REQUEST;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class NonExistentCartError extends Error {
  constructor(message) {
    super(message);
    this.name = "NonExistentCartError";
    this.status = NOT_FOUND;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class InvalidCartProductQuantityError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCartProductQuantityError";
    this.status = BAD_REQUEST;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
