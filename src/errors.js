export function ClientError(code, message, parsedJsonResponse) {
  this.name = 'ClientError'
  this.code = code
  this.message = message
  this.data = parsedJsonResponse
}
ClientError.prototype = Object.create(Error.prototype);
ClientError.prototype.constructor = ClientError;

export function ServerError(code, message, parsedJsonResponse) {
  this.name = 'ServerError'
  this.code = code
  this.message = message
  this.data = parsedJsonResponse
}
ServerError.prototype = Object.create(Error.prototype);
ServerError.prototype.constructor = ServerError;
