

const UpdateController = {
    test: async (request, reply) => {
        let { params } = request

        reply.send({
            success: false,
            ready: true,
            message: 'OK',
            params
        })
    }

}



module.exports = UpdateController


