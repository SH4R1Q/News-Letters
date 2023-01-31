const express = require("express");
const bodyParser = require("body-parser");
const request  = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); //to specify static files
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",function(req,res){
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const email = req.body.email;
    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : fname,
                    LNAME : lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    // console.log(`your data is ${fname} ${lname} with email as ${email}.`);
    // https.request(url, options, function())
    const url = "https://us21.api.mailchimp.com/3.0/lists/84a5095921";
    const options = {
        method : "POST",
        auth : "shariq:f80358f1109a4d5eae2b8e920984c73f-us21"
    }
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});
app.post("/failure",function(req,res){
    res.redirect("/");
    });
app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000....");
});

// key : f80358f1109a4d5eae2b8e920984c73f-us21
// id  : 84a5095921