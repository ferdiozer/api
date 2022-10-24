const Auth = require('../handlers/Auth')

module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: Auth.test
  })
  next()
}
