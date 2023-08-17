import { UNAUTHORIZED } from "../../utils/httpReponses.js";

export class ExpiredTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ExpiredTokenError";
    this.status = UNAUTHORIZED;
  }

  getError() {
    return { status: this.status, error: this.name, message: this.message };
  }
}
