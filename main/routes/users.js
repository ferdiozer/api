const {
    listUsers,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    getMe,
} = require("../handlers/users");

const getUsersopts = {
    schema: {
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        password: { type: "string" }
                    },
                },
            },
        },
    },
    handler: listUsers,
};

const getUserOpts = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    age: { type: "integer" },
                },
            },
        },
    },
    handler: getUser,
};

const updateItemOpts = {
    schema: {
        body: {
            type: "object",
            required: ["name", "age"],
            properties: {
                name: { type: "string" },
                age: { type: "integer" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
    handler: updateUser,
};
const postUserOpts = {
    schema: {
        body: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" }
            },
        },
        response: {
            201: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" }
                },
            },
        },
    },
    handler: addUser,
};
const deleteUserOpts = {
    schema: {
        response: {
            200: {
                type: "string",
            },
        },
    },
    handler: deleteUser,
};


async function routes(fastify, options, next) {
    fastify.get("/", getUsersopts)
    fastify.post("/", postUserOpts)
    fastify.get("/:id", getUserOpts)
    fastify.put("/:id", updateItemOpts)
    fastify.delete("/:id", deleteUserOpts)
    fastify.get("/me", {
        handler: getMe
    })

    next()
}
module.exports = routes;