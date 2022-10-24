const { dbTables } = require("../config");

const ObjectID = require("mongodb").ObjectID;



const { userModel } = require('../lib/User')


async function listUsers(req, reply) {
    const users = this.mongo.db.collection(dbTables.users);
    const result = await users.find({}).toArray();
    reply.send(result);
}

async function addUser(req, reply) {
    const { email, password, name } = req.body;
    const data = { email, password, name };
    const mResult = await userModel({ db: this.mongo.db }).create(data)
    reply.code(201).send(mResult);
}
async function getUser(req, reply) {
    const users = this.mongo.db.collection(dbTables.users);
    const result = await users.findOne({ _id: new ObjectID(req.params.id) });
    if (result) {
        return reply.send(result);
    }
    reply.code(500).send({ message: "Not found" });
}
async function updateUser(req, reply) {
    const users = this.mongo.db.collection(dbTables.users);

    const { name, age } = req.body;

    const updateDoc = {
        $set: {
            name,
            age,
        },
    };
    const result = await users.updateOne(
        { _id: ObjectID(req.params.id) },
        updateDoc,
        { upsert: true }
    );
    console.log(result);
    reply.send({
        message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
}
async function deleteUser(req, reply) {
    const users = this.mongo.db.collection(dbTables.users);

    const result = await users.deleteOne({ _id: ObjectID(req.params.id) });
    if (result.deletedCount) return reply.send("Deleted");
    reply.send("Could not delete. ");
}


async function createFlist(req, reply) {
   // return reply.code(201).send({message:"test"});
    const { f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,} = req.body;
    const data = { f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11, };
    const result = await userModel({ db: this.mongo.db }).createFlist(data)
    reply.code(201).send({message:"success",result});
}


module.exports = { 
    listUsers, 
    getUser, 
    addUser, 
    updateUser, 
    deleteUser ,
    createFlist
};