const { APP_PORT, MONGO_DATABASE_URL,LOGGER } = require('./config')

const fastify = require('fastify')()
//const fastify = require('fastify')({ logger: LOGGER })

const froutes = []
fastify.addHook('onRoute', (routeOptions) => {
  froutes.push({
    method: routeOptions.method,
    url: routeOptions.url,
    path: routeOptions.path,
    validation: routeOptions.attachValidation
  })
})

fastify.register(require('./lib/routes'))

fastify.register(require('fastify-cors'), {
  origin: '*'
})

fastify.register(require("fastify-mongodb"), {
  forceClose: true,
  url: MONGO_DATABASE_URL,
});

fastify.get("/", function (req, reply) {
  reply.send("Hello, world!");
});

fastify.listen(APP_PORT, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);

});


