import STATUS_CODES from '../constants/status-codes';

export default class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static UnauthorizedError() {
    return new ApiError(STATUS_CODES.UNAUTHORIZED, 'Authorisation Error');
  }

  static ForbiddenError() {
    return new ApiError(STATUS_CODES.FORBIDDEN, 'Forbidden');
  }

  static BadRequest(message) {
    return new ApiError(STATUS_CODES.BAD_REQUEST, message);
  }
}
