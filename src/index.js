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

const instance = new Client();

export class Client {
  constructor () {
    if (!instance) {
      instance = this;
    }
    return instance
  }

  static getInstance () {
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
    return fetch(url, fetchOptions).then((response) => response.json())
  }

  _bodyRequest (relativeUrl, body, method) {
    let url = baseUrl + relativeUrl
    let fetchOptions = {method,
                        headers: this.headers,
                        body: JSON.stringify(body)}
    return fetch(url, fetchOptions).then((response) => response.json())
  }

  post (relativeUrl, body) {
    _bodyRequest (relativeUrl, body, 'POST')
  }

  put (relativeUrl, body) {
    _bodyRequest (relativeUrl, body, 'PUT')
  }

  delete (relativeUrl) {
    let url = baseUrl + relativeUrl
    let fetchOptions = {method: 'DELETE',
                        headers: this.headers}
    return fetch(url, fetchOptions).then((response) => response.json())
  }
}

export class Resource extends Client {
  constructor (resourcePath) {
    this.resourcePath = resourcePath
    this.client = new Client()
  }

  get (criteria) {
    let url = typeof criteria === 'string' || typeof criteria === 'number'  ?
        this.resourcePath + '/' + criteria : this.resourcePath
    this.client.get(url, typeof criteria === 'object' && criteria)
  }
  
  post (body) {
    this.client.get(this.resourcePath, body)
  }
  
  
  put (id, body) {
    let url = this.resourcePath + '/' + id
    this.client.get(url, body)
  }
  
  delete (id) {
    let url = this.resourcePath + '/' + id
    this.client.get(url)
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
