const express = require('express')
const samlp = require('samlp')
const fs = require('fs')

// webserver
const app = express()

// auth route, the incomming saml request is encoded in the url
// the samlp library processes it and return to the original site
// with XML describing the user
app.get('/saml-login', (req, res, next) => {
	console.log('got auth request on the IdP side')
	const conf = {
		issuer: 'sbks-saml',
		cert: fs.readFileSync('./pub_key').toString(),
		key: fs.readFileSync('./priv_key').toString(),
		// when asked for auth, this service will always return this user:
		getUserFromRequest: () => ({
			id: 'martin.bydzovsky@socialbakers.com',
			emails: ['martin.bydzovsky@socialbakers.com'],
			name: {givenName: 'martin', surname: 'bydzovsky'},
			role: 'uberadmin'}),
		getPostURL: function (wtrealm, wreply, req, callback) {
			callback(null, 'http://localhost:3000/login/callback')
		},
	}
	samlp.auth(conf)(req,res, next)
})

// start the app on given port
app.listen(4000)
