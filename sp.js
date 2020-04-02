const fs = require('fs')
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const SamlStrategy = require('passport-saml').Strategy

// webserver
const app = express()
//use in-memory session store, will be wiped after a process restart
app.use(session({resave: true, secret: 'f4k1ns3cret', saveUninitialized: true}))
//middleware for parsing POST-requests
app.use(bodyParser.urlencoded({extended: false}))

// init the auth library
app.use(passport.initialize())
// necessary things to say how the user will be stored and restored in the session
passport.serializeUser((user, next) => { next(null, user)})
passport.deserializeUser((user, next) => {next(null, user)})


// allow passport to use the saml strategy
// we should be also specifying cert here so that the passport can verify authenticity of the saml response
passport.use(new SamlStrategy({
	path: '/login/callback',
	entryPoint: 'http://localhost:4000/saml-login',
	issuer: 'sbks-saml',
	cert: fs.readFileSync('./pub_key').toString(),
}, (profile, next) => {
	console.log('received and decoded XML from the IdP')
	next(null, profile)
}))

// basic route just to show contents of the session
app.get('/', (req, res) => {
	res.json(req.session)
})

// callabck url being called on successfull redirect from the IdP
// the incomming xml is decoded automatically and pupulated into the req.user
app.post('/login/callback',
	passport.authenticate('saml'), (req, res) => {
		console.log('auth done, data stored in req.user')
		req.session.user = req.user
		res.redirect('/')
})


// this creates the saml-request and sends browser to the IdP
app.get('/login', (req, res, next) => {console.log('going to redir to the IdP'); next()}, passport.authenticate('saml'))

// start the app on given port
app.listen(3000)

