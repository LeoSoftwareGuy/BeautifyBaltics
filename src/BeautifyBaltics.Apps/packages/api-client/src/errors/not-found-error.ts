export class NotFoundApiError extends Error {
  constructor(message?: string | null) {
    super(message ?? 'Not Found');
    this.name = 'Not Found';
    Object.setPrototypeOf(this, NotFoundApiError.prototype);
  }
}
