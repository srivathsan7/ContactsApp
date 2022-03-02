const express = require('express')
const path = require('path')
var session = require('express-session')
const bodyParser = require('body-parser')
const urlencodedparser = bodyParser.urlencoded({ extended: true })
const queries = require('./db_queries')
const router = new express.Router()
const { check, validationResult } = require('express-validator')
router.get('/signup',(req,res)=>{
	if(req.session.loggedIn){
    res.redirect('/home')
}
else{
    res.render('signup', { isLoggedIn: req.session.loggedIn, username: req.session.username})
}
})

router.get('/signin',(req,res)=>{
	if(req.session.loggedIn){
    res.redirect('/home')
}
else{
    res.render('signin', { isLoggedIn: req.session.loggedIn, username: req.session.username})
}
})

router.post('/signin_auth',urlencodedparser,(req,res)=>{
	var username = req.body.username
    var password = req.body.password
    console.log(username, password)
    if (username && password) {
        result = queries.findUser(username, password, (result) => {
            if (result.length > 0) {
                req.session.loggedIn = true
                req.session.username = username
                req.session.isAdmin=true
                res.redirect('/home')
            } else {
                var error2 = [{
                    msg: "Invalid Username or password"
                }]
                res.render('signin', { isWrong: true, errors: error2 })
            }
        })
    } else {
        var error2 = [{
            msg: "Invalid Username or password"
        }]
        res.render('signin', { isWrong: true, errors: error2 })
    }
})

router.post('/signup_auth', urlencodedparser, [
    check('username', 'Username should be 5 to 20 characters').isLength({ min: 5, max: 20 }),
    check('password', 'Password length should be 8 to 10 characters').isLength({ min: 8, max: 20 }),
    check('secretcode', 'Secret Code length should be 5 to 10 characters').isLength({ min: 5, max: 10 }),

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        res.render('signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: errors["errors"] })
    } else {
        queries.checkUser(req.body.username, function (results) {
            if (results.length > 0) {
                var error2 = [{
                    msg: "User Name already taken!!!"
                }]
                res.render('signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
            } else {

                let post = {
                    username: req.body.username,
                    password: req.body.password,
                    secretcode:req.body.secretcode
                }
                console.log(post)
                queries.insertUser(post)
                req.session.loggedIn = true
                req.session.username = req.body.username
                res.redirect("/home")
            }

        });

    }
});
module.exports=router;