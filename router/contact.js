const express = require('express')
const path = require('path')
var session = require('express-session')
const bodyParser = require('body-parser')
const urlencodedparser = bodyParser.urlencoded({ extended: true })
const queries = require('./db_queries')
const router = new express.Router()
const { check, validationResult } = require('express-validator')

router.get('/AddContact',(req,res)=>{
	if(req.session.loggedIn){
		res.render('add_contact', { isLoggedIn: req.session.loggedIn, username: req.session.username})

}
else{
    res.redirect('/signup')    
}
})

router.post('/add_contact_auth',urlencodedparser,[
	check('name', 'Name should be 5 to 20 characters').isLength({ min: 5, max: 20 }),
    check('email_id', 'Email ID not in proper format').isEmail().isLength({ min: 3,max:255}).normalizeEmail(),
    check('mobileno', 'Mobile number should contains 10 digits').isLength({ min: 10, max: 10 }).isNumeric(),
    ],
(req,res)=>{
	const errors = validationResult(req);
    if(req.session.loggedIn){
        if (!errors.isEmpty()) {
        console.log(errors)
        res.render('add_contact', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: errors["errors"] })
    } else {
        queries.checkContact(req.session.username,req.body.name,function (results) {
            if (results.length > 0) {
                var error2 = [{
                    msg: "Contact Name already Present!!!"
                }]
                res.render('add_contact', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
            } else {

                let post = {
                    username: req.session.username,
                    name:req.body.name,
                    email_id:req.body.email_id,
                    mobileno:req.body.mobileno
                }
                console.log(post)
                queries.addContact(req.session.username,req.body.name,req.body.email_id,req.body.mobileno)
                res.redirect("/home")
            }

        });

    }
    }
    else
    {
        res.redirect('/signup')
    }
    
})

router.get('/ViewContact',(req,res)=>{
    if(req.session.loggedIn){
        queries.getContact(req.session.username,function(result2){
            console.log(result2);
            if(result2.length!=0){
                var contacts=result2[0]['contacts']
                console.log(contacts)
                res.render('view_contact',{username:req.session.username,isLoggedIn: req.session.loggedIn,contacts:contacts})
            }
        })
    }
    else{
        res.redirect('/signup')
    }
})

module.exports=router;