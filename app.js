const express = require("express");
const bodyParser = require('body-parser');
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})


app.post("/", function(req, res){

    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;

    const url = "https://us18.api.mailchimp.com/3.0/lists/0a4557e973"

    const options = {
        method: "POST",
        auth: "bevada1:bccfa0e485b257bdf887e815804b6aaa-us18" 
    }

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name
                }
            }

        ]
    };

    const jsonData = JSON.stringify(data);

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/");
})

// API Key
// bccfa0e485b257bdf887e815804b6aaa-us18
  
// List ID
//  0a4557e973

app.listen(3000, function(req, res){
    console.log("Server running on port 3000");
})