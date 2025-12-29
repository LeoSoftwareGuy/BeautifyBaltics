export class UnprocessableEntityApiError extends Error {
  constructor(errors?: { [key: string]: string[] } | null) {
    const message = Object.values(errors || {})
      .map((error) => error.join(', '))
      .join(', ');
    super(message ?? 'Unprocessable entity');
    this.name = 'Unprocessable Entity';
    Object.setPrototypeOf(this, UnprocessableEntityApiError.prototype);
  }
}
