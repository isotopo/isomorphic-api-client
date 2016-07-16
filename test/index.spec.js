import Api, {Client, Resources} from '../src/index.js'
import { expect } from 'chai'
import nock from 'nock'

const hugo = {
  _id: '1',
  username: 'hugox123',
  email: 'hugo.cabret@gmail.com'
}

const luck = {
  _id: '2',
  username: 'lucky.green',
  email: 'luck.skywalker@futurecommerce.mx'
}

const squirtle = {
  username: 'squirtlesquirtle',
  email: 'squirtle@pokemon.wl'
}

let apiMock = nock('https://myhost.com:3000/api/v2')
    .get('/users/1').reply(200, hugo)
    .get('/users/2').reply(200, luck)
    .post('/users', squirtle).reply(201, {_id: 3})
    .put('/users/1').reply()
    .delete('/users/1').reply()

const apiConfig = {
  protocol: 'https',
  host: 'myhost.com',
  port: 3000 ,
  basePath: '/api',
  version: 2  
}

Api(apiConfig)

describe('Api Calls', () => {
  it(`should fetch users with id 1 ans 2`, function* () {
    let apiClient = new Client();
    let Users = new Resources('/users')
    
    let user = yield apiClient.get('/users/1')
    let usertwo = yield Users.get('1')

    
    expect(user).to.have.property('username', hugo.username)
    expect(user).to.have.property('email', hugo.email)
    expect(usertwo).to.have.property('username', luck.username)
    expect(usertwo).to.have.property('email', luck.email)
  })

  it(`should post new user.`, function* () {
    let apiClient = new Client();
    let Users = new Resources('/users')
    
    let user = yield apiClient.post('/users', squirtle)
    let usertwo = yield Users.post(squirtle)

    
    expect(user).to.have.property('_id', 3)
    expect(usertwo).to.have.property('_id', 3)
  })

  it(`should update the user.`, function* () {
    let apiClient = new Client();
    let Users = new Resources('/users')
    
    let user = yield apiClient.post('/users', squirtle)
    let usertwo = yield Users.post(squirtle)

    
    expect(user).to.have.property('_id', 3)
    expect(usertwo).to.have.property('_id', 3)
  })
})
