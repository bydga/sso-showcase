# Simple showcase of SSO SAML 2.0 communication between SP and IdP

## Requirements
- nodejs runtime
- free ports 3000 (service provider) and 4000 (identity provider)


## Installation
```
git clone https://github.com/bydga/sso-showcase.git
cd sso-showcase
npm install
npm run dev
```


- Then in browser go to http://localhost:3000 - it just outputs the actual contents of the session
- http://localhost:3000/login initiates the login flow, redirects to the idp, "creates" the user to be logged in and finally redirects back to the SP
the session contents is displayed again to verify the user is stored and logged on the SP side

