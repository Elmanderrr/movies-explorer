import _ from 'underscore@1.8.3/underscore'
import Api from './themoviedbApi'
import helpers from './helpers'
import View from './View'

class Model {
	constructor(){
	}

	getMovies(page) {

		let promises = _.map(helpers.generateArray(page || 5), (n)=> {

			return new Promise((resolve,reject)=> {

				return Api.get('movies','getPopular',{page:n,language:'ru'})
					.then( promise => {
						return resolve(promise.results)
					})

			})

		});

		return Promise.all(promises)
					.then(data => {
						return helpers.concatArrays(data)
					})


	}


	filterByRating (data,rating) {
		return rating ? _.filter(data, movie => movie.vote_average > rating) : data
	}

	filteByVoteCount (data, voteCount) {
		return voteCount ? _.filter(data, movie => movie.vote_count > voteCount) : data
	}

}


export default Model