# Locc.it - Share online passwords safely
   
This project is a cool little idea for a problem I experience occasionally where I need to share sensitive information, it adds a barrier of safety and helps prevent details from being found by unwanted eyes. 

If you see a problem with it, please do raise a pull request.  

client/.env
```
REACT_APP_STRIPE_KEY=
REACT_APP_SITE_URL=
REACT_APP_GOOGLE_SITE_KEY=
```

server/config/prod.js
```
module.exports = {
    mongoURI: "",
    siteURL: "",
    cookieKey: "",
    localSecret: "",
    emailUser: "",
    emailPass: "",
    facebookClientId: "",
    facebookSecretKey: "",
    googleClientId: "",
    googleClientSecret: "",
    githubPubKey: "",
    githubSecretKey: "",
    stripePubKey: "",
    stripeSecretKey: ""
}
```