import STATUS_CODES from '../constants/status-codes.js';

export default class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const UnauthorizedError = () =>
  new ApiError(STATUS_CODES.UNAUTHORIZED, 'Authorisation Error');

export const ForbiddenError = () =>
  new ApiError(STATUS_CODES.FORBIDDEN, 'Forbidden');

export const BadRequest = message =>
  new ApiError(STATUS_CODES.BAD_REQUEST, message);
