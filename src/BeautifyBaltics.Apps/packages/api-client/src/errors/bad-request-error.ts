export class BadRequestApiError extends Error {
  constructor(message?: string | null) {
    super(message ?? 'Bad Request');
    this.name = 'Bad Request';
    Object.setPrototypeOf(this, BadRequestApiError.prototype);
  }
}
