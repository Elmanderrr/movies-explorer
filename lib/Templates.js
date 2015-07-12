import _ from 'underscore@1.8.3/underscore'

class Templates {
	constructor(){
		_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
		
		// adult: falsebackdrop_path: "/dkMD5qlogeRMiEixC4YNPUvax2T.jpg"
		// genre_ids: Array[4] id: 135397 original_language: "en"
		// original_title: "Jurassic World"
		// overview: "Продолжение знаменитой франшизы про возрождение динозавров на нашей планете.
		// Тысячи людей спешат увидеть Мир Юрского периода,
		// но безопасное на первый взгляд развлечение может обернуться угрозой для их жизней… 
		// "popularity: 48.095508
		// poster_path: " / uXZYawqUsChGSj54wcuBtEdUJbh.jpg 
		// "release_date: "2015 - 06 - 12 
		// "title: Мир Юрского периода 
		// "video: false
		// vote_average: 7
		// vote_count: 956

		this.templates = {
			movieItem:_.template(`

					<%_.each(movies, function(movie){ %>
						<div class="row">

							<div class="col-md-5">
								<a href="#">
									<img class="img-responsive" alt=""
									src="https://image.tmdb.org/t/p/w396/{{ movie.backdrop_path }}" >
								</a>
							</div>

							<div class="col-md-7">
								<h3>{{ movie.title }}</h3>
								<h4 class="inline">
									{{ movie.vote_average}}/10
								</h4>
								<span class="label label-success">{{ movie.vote_count }} голосов</span>

								<p>
									{{ movie.overview }}
								</p>
								<a class="btn btn-primary" href="#">
									View Project
									<span class="glyphicon glyphicon-chevron-right"></span>
								</a>
							</div>

						</div>
						<hr />
					<%})%>		
			`)
		}
	}


}
export default Templates