export class ClientError extends Error {
  constructor(code, message, jsonResponse) {
    super(message)
    this.name = 'ClientError'
    this.code = code
    this.message = message
    this.data = jsonResponse
  }
}

export class ServerError extends Error {
  constructor(code, message, jsonResponse) {
    super(message)
    this.name = 'ServerError'
    this.code = code
    this.message = message
    this.data = jsonResponse
  }
}
