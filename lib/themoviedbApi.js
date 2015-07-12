import theMovieDb from 'cavestri/themoviedb-javascript-library@master/themoviedb'

class Api {
	constructor () {
		this.db = theMovieDb;
		this.db.common.api_key = '0acc3fb9defb9e0adde13deedc6182d1';
	}

	success (resp) {
		return this.resolve(JSON.parse(resp))
	}
	error (error) {
		return this.reject(JSON.parse(error))
	};

	get (collection, method, props) {

		return new Promise((resolve,reject) => {

			let promise = {
				resolve:resolve,
				reject:reject
			}

			if (!this.db[collection][method]) {
				return console.error(`There is no ${method} function`)
			}

			this.db[collection][method](
					props,
					this.success.bind(promise),
					this.error.bind(promise)
				)
		})

	}
}

export default new Api
