

const _ = require('lodash')
const bcrypt = require('bcrypt')
const { ObjectID } = require('mongodb')
const { dbTables } = require('../config')
const { OrderedMap } = require('immutable')

const saltRound = 10;


class User {
    constructor(opts) {
        this.users = new OrderedMap();
        this.db = opts.db
        this.tokenModel = opts.tokenModel
    }

    aggregate(q = []) {
        q = [
            {
                $sort: { created: -1 }
            },
        ]
        return new Promise((resolve, reject) => {
            this.db.collection(dbTables.users).aggregate(q, (err, results) => {
                return err ? reject(err) : resolve(results);
            });
        })
    }


    find(query = {}, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.collection(dbTables.users).find(query, options).toArray((err, users) => {
                return err ? reject(err) : resolve(users);
            })
        });
    }

    search(q = "") {
        return new Promise((resolve, reject) => {
            const regex = new RegExp(q, 'i');
            const query = {
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } },
                    { username: { $regex: regex } },
                ],
            };
            this.db.collection(dbTables.users).find(query, {
                _id: true,
                name: true,
                username: true,
                avatar: true,
                created: true,

            })
                .limit(20)
                .toArray((err, results) => {
                    if (err || !results || !results.length) {
                        return reject({ message: "bulunmadı." })
                    }
                    return resolve(results);
                });
        });
    }

    login(user) {
        const email = _.get(user, 'email', '');
        const password = _.get(user, 'password', '');
        console.log("login:!!!", user)
        return new Promise((resolve, reject) => {
                if (!password || !email) { // if (!password || !email || !isEmail(email)) {
                    return reject({ message: "Geçersiz parametreler" })
                }
                // find in database with email
                this.findUserByEmailOrUsername(email, (err, result) => {
                    console.log("findUserByEmailOrUsername", { err, result })
                    if (err) {
                        console.log(err)
                        return reject({ message: "Böyle bir kullanıcı bulunamadı." });
                    }
                    // if found user we have to compare the password hash and plain text.
                    const hashPassword = _.get(result, 'password');
                    if (!hashPassword) {
                        return reject({ message: "Bağlı olan sosyal medya ile hesabınızı açmalısınız." });
                    }

                    const isMatch = bcrypt.compareSync(password, hashPassword);
                    if (!isMatch) {
                        return reject({ message: "Şifre hatalı" });
                    }
                    // user login successful let creat new token save to token collection.
                    const userId = result._id;
                    this.tokenModel.create(userId).then((token) => {
                        token.user = result;
                        return resolve(token);
                    }).catch(err => {
                        console.log(err)
                        return reject({ message: "Başarısız" });
                    })
                });

        })
    }

    findUserByEmail(email, callback = () => {
    }) {


        this.db.collection(dbTables.users).findOne({ email: email }, (err, result) => {

            if (err || !result) {

                return callback({ message: "User not found." })
            }

            return callback(null, result);

        });


    }


    findUserByEmailOrUsername(email, callback = () => { }) {

        const q = { $or: [{ email: email }, { username: email }] }

        this.db.collection(dbTables.users).findOne(q, (err, result) => {

            if (err || !result) {

                return callback({ message: "bulunamadı." })
            }

            return callback(null, result);

        });

    }

    findUserByFbId(FBid, callback = () => {
    }) {


        this.db.collection(dbTables.users).findOne({ FBid }, (err, result) => {

            if (err || !result) {

                return callback({ message: "User not found." })
            }

            return callback(null, result);

        });


    }


    load(id) {
        id = `${id}`;
        return new Promise((resolve, reject) => {
            // find in cache if found we return and dont nee to query db
            const userInCache = this.users.get(id);
            if (userInCache) {
                return resolve(userInCache);
            }
            // if not found then we start query db
            this.findUserById(id, (err, user) => {
                if (!err && user) {
                    this.users = this.users.set(id, user);
                }
                return err ? reject(err) : resolve(user);
            })
        })
    }

    findUserById(id, callback = () => {
    }) {
        if (!id) {
            return callback({ message: "User not found" }, null);
        }
        const userId = new ObjectID(id);
        this.db.collection(dbTables.users).findOne({ _id: userId }, (err, result) => {
            if (err || !result) {
                return callback({ message: "User not found" });
            }
            return callback(null, result);
        });
    }



    setUserFormated(user) {
        return new Promise((resolve, reject) => {
            try {

                // return callback başarılı ise
                const channel = _.get(user, 'channel');
                const email = _.get(user, 'email');
                let userFormatted = {}
                if (channel == "facebook") {
                    userFormatted = {
                        name: `${_.trim(_.get(user, 'name'))}`,
                        email: email,
                        username: _.get(user, 'FBuserID', ''),
                        avatar: _.get(user, 'avatar', ''),
                        FBaccessToken: _.get(user, 'FBaccessToken', ''),
                        FBid: _.get(user, 'FBid', ''),
                        facebookData: _.get(user, 'fbData'),
                        channel: "facebook",
                        created: new Date(),
                    };
                }
                else if (channel == "google") {
                    userFormatted = {
                        name: _.get(user, 'profileObj.name', ""),
                        email: _.get(user, 'profileObj.email'),
                        username: _.get(user, 'googleId'),
                        avatar: _.get(user, 'profileObj.imageUrl'),
                        googleData: user,
                        channel: "google",
                        created: new Date(),
                    };
                }
                else {
                    const password = _.get(user, 'password');
                    const hashPassword = bcrypt.hashSync(password, saltRound);
                    userFormatted = {
                        _id: new ObjectID(),
                        name: `${_.trim(_.get(user, 'name'))}`,
                        email: email,
                        username: `${_.trim(_.get(user, 'username'))}`,
                        password: hashPassword,
                        created: new Date(),
                    };
                }
                return resolve(userFormatted);
            } catch (error) {
                return reject(error);
            }

        });
    }

    create(user) {
        return new Promise((resolve, reject) => {

            this.setUserFormated(user).then(user=>{
                this.db.collection(dbTables.users).insertOne(user, (err, info) => {
                    if (err) {
                        return reject(err);
                    }
                    const userId = _.get(user, '_id').toString();
                    this.users = this.users.set(userId, user);
                    return resolve(user);
                });
            }).catch(err=>{
                return reject(err);
            })

        });
    }

    createFlist({
        f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,
    }) {
		const insertData = {
            f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,
			created: new Date(),
		}
		return new Promise((resolve, reject) => {
			this.db.collection(dbTables.fList).insertOne(insertData, (err, info) => {
				return err ? reject(err) : resolve(insertData);
			})
		})
	}

}

module.exports = {
    userModel: (opts) => new User(opts)
}