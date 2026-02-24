export class UnauthorizedApiError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'Unauthorized';
    Object.setPrototypeOf(this, UnauthorizedApiError.prototype);
  }
}
