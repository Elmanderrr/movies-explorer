import Model from './Model'
import Controller from './Controller'
import View from './View'
import Templates from './Templates'

import _ from 'underscore@1.8.3/underscore'
import Api from './themoviedbApi'
import helpers from './helpers'
import $ from 'jquery';
import ripple from 'bower_components/bootstrap-material-design/dist/js/ripples'
import material from 'bower_components/bootstrap-material-design/dist/js/material'

$.material.init();


class MoviesBooster {
	constructor(){
		this.templates = new Templates();
		this.model = new Model()
		this.view = new View(this.templates)
		this.controller = new Controller(this.model, this.view);
	}
}

let Booster = new MoviesBooster();







