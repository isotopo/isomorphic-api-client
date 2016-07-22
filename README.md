# isomorphic-api-client

Simple, minimalistic, isomorphic generic client to make requests to an api

## Installation

    npm install --save isomorphic-api-client

## Usage

First configure the api communication, you need do it once
```javascript
import Api from 'isomorphic-api-client'

// our API url is: https://myhost.com:3000/api/v2

Api({
  protocol: 'https',
  host: 'myhost.com',
  port: 3000 ,
  basePath: '/api',
  version: 2
})

```

make request to the api:
```javascript
import {Client} from 'isomorphic-api-client'

const skirtl = {
  username: 'squirtlesquirtle',
  email: 'fake@badmail.moc'
}

const squirtle = {
  email: 'squirtle@pokemon.wl'
}

let apiClient = new Client();

let user = await apiClient.get('/users/1')
let theNew = await apiClient.post('/users', skirtl)
theNew = await apiClient.update('/users/1', squirtle)
await apiClient.delete('users/1')
```

or you can do it more easy:
```javascript
import {Resources} from 'isomorphic-api-client'

const Users = new Resources('/users')

let user = await Users.get('1') // GET https://myhost.com:3000/api/v2/users/1
let theNew = await Users.post(skirtl) // POST https://myhost.com:3000/api/v2/users
theNew = await apiClient.update(2, squirtle) // UPDATE https://myhost.com:3000/api/v2/users/2
await apiClient.delete('2') // DELETE https://myhost.com:3000/api/v2/users/2
```

And you can do it with Auth:
```javascript
import {Resources, Client} from 'isomorphic-api-client'
import {ClientError} from 'isomorphic-api-client/errors'

const Users = new Resources('/users')
let apiClient = new Client()

try {
  let user = await Users.get('1/secret') // GET https://myhost.com:3000/api/v2/users/1/secret and FAIL!
} catch (error) {
  if (error instanceof ClientError && error.code == 401) {     
    // do it log in
    let token = await apiClient.post('/auth/login', {username: 'hugox123', password: 'automaticRobot234'}) // now get the token
    apiClient.setAuthToken(token) //set the token
    let user = await Users.get('1/secret') // GET https://myhost.com:3000/api/v2/users/1/secret and.. EUREKA!!
  }
}
```


ToDo:
- [X] Tests and readme for Auth token requests
- [ ] Create most common Error Clases (NotFound, Unauthorized, InternalServerError, ...)
- [ ] Methods for special cases, like catch Auth token of headers and not of body
- [ ] Methods to simplify isomorphic Auth


## License

MIT Licensed. Copyright (c) Futurecommerce 2016.
