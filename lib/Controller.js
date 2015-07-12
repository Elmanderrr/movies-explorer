import _ from 'underscore@1.8.3/underscore'

class Controller {
	constructor(model,view) {
		this.model = model;
		this.view = view;

		this.config = {
			rating:6.6,
			voteCount:1000,
			page:10
		}


		this.view.bind('FILTER:submit', props =>{
			this.getMovies( this.config.page, props.rating, props.votes )
		})


		this.getMovies( this.config.page, this.config.rating, this.config.voteCount );


	}

	getMovies(page,rating,voteCount) {
		this.model.getMovies( page )
			.then(data => {
				this.model.movies = data;
				return data;
			})
			.then( data => this.model.filterByRating(data,rating) )
			.then( data => this.model.filteByVoteCount(data,voteCount) )
			.then( this.insertMovies.bind(this) )		
	}


	insertMovies(data){
		this.view.render(data)
	}


}

export default Controller