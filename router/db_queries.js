var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
const findUser = (username, password, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ContactsApp");
        var query = { username: username, password: password }
        dbo.collection("User").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}

const insertUser = (user) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ContactsApp");
        dbo.collection("User").insertOne(user, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document inserted");
            db.close();
        });
    });
}

const checkUser = (username, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ContactsApp");
        var query = { username: username }
        dbo.collection("User").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}

const checkContact =(username,CName,callback)=>{
	MongoClient.connect(url,function(err,db){
		if(err) throw err;
		var dbo=db.db("ContactsApp");
		var query={username:username,contacts:{ $elemMatch: { name: CName} }};
		dbo.collection("User").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
	});
}

const addContact = (username,CName,email_id,mobileno) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ContactsApp");
        dbo.collection("User").updateOne({username:username},{$push:{ contacts: {name:CName,email_id:email_id,mobileno:mobileno}}},function(err1, res) {
            if (err1) throw err1;
            console.log("1 document updated");
            db.close();
        });
    });
}

const getContact = (username,callback)=>{
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo=db.db("ContactsApp");
        var query={username:username};
        dbo.collection("User").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    })
}
module.exports={
	findUser,
	insertUser,
	checkUser,
	checkContact,
	addContact,
    getContact
}