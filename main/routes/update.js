const Update = require('../handlers/Update')


module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'POST',
    url: '/update',
    handler: Update.test
  })


  next()
}
