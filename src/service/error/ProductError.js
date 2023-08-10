import { BAD_REQUEST, CONFLICT, NOT_FOUND } from "../../utils/httpReponses.js";
export class ExistentProductCodeError extends Error {
  constructor(message) {
    super(message);
    this.name = "ExistentProductCodeError";
    this.status = CONFLICT;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}

export class InvalidProductFieldError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidProductFieldError";
    this.status = BAD_REQUEST;
  }
  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class InvalidProductIdError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidProductIdError";
    this.status = BAD_REQUEST;
  }
  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
export class NonExistentProductError extends Error {
  constructor(message) {
    super(message);
    this.name = "NonExistentProductError";
    this.status = NOT_FOUND;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
