export class CustomResponseError extends Error {
  status: number;

  message: string;

  details: string;

  constructor(status: number, message: string, details?: string) {
    super(message);

    this.status = status;
    this.message = message;
    this.details = details || 'No details';
  }
}
