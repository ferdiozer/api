
const _ = require('lodash')
const { ObjectID } = require('mongodb')
const { dbTables } = require('../config')
const { OrderedMap } = require('immutable')


class Token {
	constructor(opts) {
		this.tokens = new OrderedMap();
		this.db = opts.db
		this.userModel = opts.userModel
	}


	logout(token) {
		return new Promise((resolve, reject) => {
			const tokenId = _.toString(token._id);
			this.tokens = this.tokens.remove(tokenId);
			this.db.collection(dbTables.tokens).remove({ _id: new ObjectID(tokenId) }, (err, info) => {
				return err ? reject(err) : resolve(info);
			});
		})
	}

	loadTokenAndUser(id) {
		return new Promise((resolve, reject) => {
			this.load(id).then((token) => {
				const userId = `${token.userId}`;
				this.userModel.load(userId).then((user) => {
					token.user = user;
					return resolve(token);
				}).catch(err => {
					return reject(err);
				});
			}).catch((err) => {
				return reject(err);
			});
		})
	}

	load(id = null) {
		id = `${id}`;
		return new Promise((resolve, reject) => {
			if (!id || id.length != 24) {
				return reject({ message: "token id is invalid" })
			}
			const tokenFromCache = this.tokens.get(id);
			if (tokenFromCache) {
				return resolve(tokenFromCache);
			}
			this.findTokenById(id, (err, token) => {
				if (!err && token) {
					const tokenId = token._id.toString();
					this.tokens = this.tokens.set(tokenId, token);
				}
				return err ? reject(err) : resolve(token);
			});
		})
	}

	findTokenById(id, cb = () => { }) {
		const idObject = new ObjectID(id);
		const query = { _id: idObject }
		this.db.collection(dbTables.tokens).findOne(query, (err, result) => {
			if (err || !result) {
				return cb({ message: "Not found" }, null);
			}
			return cb(null, result);
		})
	}

	create(userId) {
		const token = {
			userId: userId,
			created: new Date(),
		}
		return new Promise((resolve, reject) => {
			this.db.collection(dbTables.tokens).insertOne(token, (err, info) => {
				return err ? reject(err) : resolve(token);
			})
		})
	}

	createAdmin(userId) {
		const token = {
			userId: userId,
			created: new Date(),
			userType: 2
		}
		return new Promise((resolve, reject) => {
			this.db.collection(dbTables.tokens).insertOne(token, (err, info) => {
				return err ? reject(err) : resolve(token);
			})
		})
	}

}


module.exports = {
	tokenModel: (opts) => new Token(opts)
}