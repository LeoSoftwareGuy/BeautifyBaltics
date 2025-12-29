export class ServerErrorApiError extends Error {
  constructor() {
    super('Something went wrong');
    this.name = 'Server Error';
    Object.setPrototypeOf(this, ServerErrorApiError.prototype);
  }
}
