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

Users = new Resources('/users')

let user = await Users.get('1') // GET https://myhost.com:3000/api/v2/users/1
let theNew = await Users.post(skirtl) // POST https://myhost.com:3000/api/v2/users
theNew = await apiClient.update(2, squirtle) // UPDATE https://myhost.com:3000/api/v2/users/2
await apiClient.delete('2') // DELETE https://myhost.com:3000/api/v2/users/2
```


ToDo:
- [ ] Tests and readme for Auth token requests


## License

MIT Licensed. Copyright (c) Futurecommerce 2016.
