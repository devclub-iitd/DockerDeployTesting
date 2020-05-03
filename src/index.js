const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const validateEmail = require("./utils")
const bodyParser = require('body-parser');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Body Parser Middleware
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});

app.post('/sendmail', async (req,res) => {

    const oauth2Client = new OAuth2(
        process.env["CLIENT_ID"], // ClientID
        process.env["CLIENT_SECRET"], // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: process.env["REFRESH_TOKEN"]
    });
    
    const accessToken = oauth2Client.getAccessToken()
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'Gmail',
        auth: {
            type: "OAuth2",
            user: "portfoliocreatoriitd@gmail.com", 
            clientId: process.env["CLIENT_ID"],
            clientSecret: process.env["CLIENT_SECRET"],
            refreshToken: process.env["REFRESH_TOKEN"],
            accessToken: accessToken
        },
        logger:true,
        debug:true,
        proxy : process.env["https_proxy"]
    });

    const email = req.body.email;

    console.log("Mail will be sent to : " + email)

    if( !validateEmail(email) ) {
        return res.status(400).json({ msg : "Not a valid email address"})
    }

    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', 
            to: email,
            subject: "Hello ✔", 
            text: "Hello world?", 
            html: "<b>Hello world?</b>"
        }, (err) => {
            console.log("ERROR");
            console.log(err)
        });

        // dump info about mail to console
        console.log(info)

        res.status(200).json({msg : "Mail sent successfully"})

    } catch (err) {
        console.log(err)
        res.status(400).json({msg : "An error occured"})
    }
}); 

app.listen(process.env["PORT"] , () => console.log(`Gator app listening on ${process.env["PORT"]}!`));
