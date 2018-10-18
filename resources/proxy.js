module.exports = {


	// '/api/*': {
	// 	target: 'http://127.0.0.1:2018',
	// 	secure: false,
	// },

	'/api/*': {
		// target: 'http://183.192.162.101:8084',
		target: 'http://183.192.162.101:8084',

		// target: 'http://183.192.162.16:2443',
		secure: false,
		pathRewrite: { '^/api': '' }
	},

	'/app/*': {
		// target: 'http://183.192.162.101:8084',
		target: 'http://117.131.17.222:8088',
		secure: false,
		pathRewrite: { '^/app': '' }
	},

};
