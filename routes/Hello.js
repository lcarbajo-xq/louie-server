const { Router } = require('express')
const { sayHello, getHello } = require('../controllers/helloController')

const hello = Router()

hello.get('/hello', sayHello)

hello.post('/hello/:hello', getHello)

module.exports = hello

// '/hello', { version: 'v1' }
