import _ from 'underscore@1.8.3/underscore'
import helpers from './helpers'
import Templates from './Templates'

class View {
	constructor(templates){
		this.template = templates;
		this.elements = {
			$$movieContainer:helpers.qs('.posters'),
			$$rating:helpers.qs('#filter-rating'),
			$$votes:helpers.qs('#filter-votes_count'),
			$$filter:helpers.qs('#filter')
		}

	}

	render(movies){
		if (!movies) {
			return console.error(`Movies array wasn't given`);
		}


		this.elements.$$movieContainer.innerHTML = this.template.templates.movieItem({movies:movies});
	}

    bind(event, handler) {

    	switch(event) {

    		case 'FILTER:submit':
	            helpers.$on(this.elements.$$filter, 'submit', (e)=>{
	            	e.preventDefault();
	            	
	                handler({
	                	rating:this.elements.$$rating.value,
	                	votes:this.elements.$$votes.value
	                });
	            });
	            break;
    			
	        default:
	        	break;
    	}
    }
}

export default View