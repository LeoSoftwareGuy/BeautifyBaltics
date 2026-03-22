export class BadRequestApiError extends Error {
  readonly detail: string | null | undefined;

  constructor(message?: string | null) {
    super(message ?? 'Bad Request');
    this.name = 'Bad Request';
    this.detail = message;
    Object.setPrototypeOf(this, BadRequestApiError.prototype);
  }
}
