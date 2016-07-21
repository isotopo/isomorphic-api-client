import 'isomorphic-fetch'

let baseUrl = '';
let apiAuthToken = '';

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

let instance;

export class Client {
  constructor () {
    if (!instance) {
      instance = this;
    }
    return instance
  }

  setAuthToken (token) {
    apiAuthToken = token
  }

  get headers () {
    return apiAuthToken ? {...jsonHeaders, 'Authorization' : apiAuthToken} : jsonHeaders
  }

  get (relativeUrl, query) {
    let encodedQuery = query ? '?' + encodeQueryParams(query) : ''
    let url = baseUrl + relativeUrl + encodedQuery
    let fetchOptions = {method: 'GET',
                        headers: this.headers}
    return fetch(url, fetchOptions).then((response) => this._responseHandler(response))
  }

  _bodyRequest (relativeUrl, body, method) {
    let url = baseUrl + relativeUrl
    let fetchOptions = {method,
                        headers: this.headers,
                        body: JSON.stringify(body)}               
    return fetch(url, fetchOptions).then((response) => this._responseHandler(response))
  }

  _responseHandler (response){
    let json = response.json()
    return /^([2]{1}\d[0-9]{1})$/.test(response.status) ? Promise.resolve(json) : json.then(Promise.reject.bind(Promise))
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
    return fetch(url, fetchOptions).then((response) => response.json())
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
  let encodedQuery = [];
  for(let param in query)
    if (query.hasOwnProperty(param)) {
      encodedQuery.push(param + "=" + query[param]);
    }
  return encodedQuery.join("&");
}

function handleFetchResponse (response) {
  if (response.code < 400) return response.json()
  else return response.json().then((json) => handleFetchErrorResponse(response, json))
}

function handleFetchErrorResponse (response, dataJsonResponse) {
  const {code, statusText} = response
  if (response.code < 500) throw new ClientError(code, statusText, dataJsonResponse)
  else (response.code => 500) throw new ServerError(code, statusText, dataJsonResponse)
  }
}
