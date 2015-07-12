let helpers = {

	generateArray:(n)=>{
		let result = []
		for (let i = 1; i <= n;i++) {
			result.push(i)
		};
		return result
	},

	concatArrays:(arrays)=> [].concat.apply([],arrays),

	qs: function (selector, scope) {
		return (scope || document).querySelector(selector);
	},

	qsa: function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	},

	$on: function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	}

}

export default helpers