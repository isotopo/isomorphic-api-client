import 'isomorphic-fetch'
import {ClientError, ServerError} from './errors'

let baseUrl = ''
let apiAuthToken
let middlewares = [];

const jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

export default function configureClient ({
  protocol = 'https',
  host,
  port,
  basePath,
  version
}){
  baseUrl = `${protocol}://${host}${port ? ':' + port : ''}${basePath || ''}/${version ? 'v' + version : ''}`
}

let instance

export class Client {
  constructor () {
    if (!instance) {
      instance = this
    }
    return instance
  }

  get headers () {
    return apiAuthToken ? {...jsonHeaders, 'Authorization' : (typeof apiAuthToken === 'function' ? apiAuthToken() : apiAuthToken)} : jsonHeaders
  }

  setAuthToken (token) {
    apiAuthToken = token
  }

  addMiddleware(middleware){
    middlewares.push(middleware)
  }

  removeMiddleware(middleware) {
    let middlewareIndex = middlewares.indexOf(middleware)
    middlewares.splice(middlewareIndex, 1)
  }

  get (relativeUrl, query) {
    let encodedQuery = query ? '?' + encodeQueryParams(query) : ''
    let url = baseUrl + relativeUrl + encodedQuery
    let fetchOptions = {method: 'GET',
                        headers: this.headers}
    return modifiedFetch(url, fetchOptions)
  }

  _bodyRequest (relativeUrl, body, method) {
    let url = baseUrl + relativeUrl
    let fetchOptions = {method,
                        headers: this.headers,
                        body: JSON.stringify(body)}
    return modifiedFetch(url, fetchOptions)
  }

  post (relativeUrl, body) {
    return this._bodyRequest (relativeUrl, body, 'POST')
  }

  put (relativeUrl, body) {
    return this._bodyRequest (relativeUrl, body, 'PUT')
  }

  delete (relativeUrl) {
    let url = baseUrl + relativeUrl
    let fetchOptions = {method: 'DELETE',
                        headers: this.headers}

    return modifiedFetch(url, fetchOptions)
  }
}

export class Resources {
  constructor (resourcePath) {
    this.resourcePath = resourcePath
    this.client = new Client()
  }

  get (criteria) {
    let url = typeof criteria === 'string' || typeof criteria === 'number'  ?
        this.resourcePath + '/' + criteria : this.resourcePath
    return this.client.get(url, typeof criteria === 'object' && criteria)
  }

  post (body) {
    return this.client.post(this.resourcePath, body)
  }


  put (id, body) {
    let url = this.resourcePath + '/' + id
    return this.client.put(url, body)
  }

  delete (id) {
    let url = this.resourcePath + '/' + id
    return this.client.delete(url)
  }

}

function encodeQueryParams (query) {
  let encodedQuery = []
  for(let param in query)
    if (query.hasOwnProperty(param)) {
      encodedQuery.push(param + "=" + query[param])
    }
  return encodedQuery.join("&")
}

function handleFetchResponse (response) {
  if (response.status < 400) return response.json()
  else return response.json().then((json) => handleFetchErrorResponse(response, json))
}

function handleFetchErrorResponse (response, dataJsonResponse) {
  const {status, statusText} = response
  if (response.status < 500) throw new ClientError(status, statusText, dataJsonResponse)
  else throw new ServerError(status, statusText, dataJsonResponse)
}

function modifiedFetch (...args) {
  let promise = Promise.resolve(args)

  for(let i = 0; i < middlewares.length; i++) {
    let middleware = middlewares[i]
    let {request: middlewareRequest} = middleware
    if (middlewareRequest)
      promise = promise.then(args => middlewareRequest(...args))
    else if (typeof middleware === 'function'){
      if (process && process.env.NODE_ENV === 'development')
        console.log("Warning: middleware function is deprecated use object ({request, response})")
      middleware(...args)
    }
  }

  promise = promise.then((args) => fetch(...args))

  // temporary json middleware applied
  promise = promise.then(handleFetchResponse)

  for(let i = 0; i < middlewares.length; i++) {
    let {response: middlewareResponse} = middlewares[i]
    if (middlewareResponse)
      promise = promise.then(middlewareResponse)
  }

  return promise
}
