const express = require('express')
const path = require('path')
const helmet = require('helmet')
const passport = require('passport');
const bodyParser = require('body-parser')
const app = express()
const hbs = require('hbs')
const userRouter = require('./router/user')
const contactRouter = require('./router/contact')
const port = process.env.PORT || 3000
var session = require('express-session')
app.use(helmet.hidePoweredBy())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(userRouter)
app.use(contactRouter)
app.use(express.static(path.join(__dirname, 'public')))
const viewsPath = path.join(__dirname, 'templates/views')
const partialsPath = path.join(__dirname, 'templates/partials')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/home', (req, res) => {

    if(req.session.loggedIn){
    res.render('home', { isLoggedIn: req.session.loggedIn, username: req.session.username,isAdmin:req.session.isAdmin})
}
else{
    res.render('home', { isLoggedIn: req.session.loggedIn, username: req.session.username})
}
})
app.get('/logout',(req,res)=>{
    req.session.loggedIn=false
    req.session.username=null
    res.redirect('/home')
})
app.listen(port, () => {
    console.log('Server is up on port :' + port)
})