import { BAD_REQUEST, CONFLICT } from "../../utils/httpReponses.js";

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