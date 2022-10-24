const Register = require('../handlers/Register')


module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: Register.register
  })


  next()
}
