//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

var keyFile = require("./key.js");
var key = keyFile.key;

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//get the input from the html file
app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  //mailchimp API *word-specific* object that has to be sent
  //according to their API documentation
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  //turning the above into json that will be sent in the request - body
  var jsonData = JSON.stringify(data);

  //these are the configuration options of the REQUEST to their API
  //includes simple http auth
  var options = {
    url: "https://us5.api.mailchimp.com/3.0/lists/1a0d578ce7",
    method: "POST",
    headers: {
      "Authorization": "kiriakos "+ key
    },
    body: jsonData
  };

  //this is the request
  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });

});


app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port: 3000");
});
