const { login } = require('../handlers/Login')


module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'POST',
        url: '/',
        handler: login
    })


    next()
}
