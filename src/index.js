const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const validateEmail = require("./utils")
const bodyParser = require('body-parser');

// Body Parser Middleware
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});

app.post('/sendmail', async (req,res) => {

    const email = req.body.email;

    console.log("Mail will be sent to : " + email)

    if( !validateEmail(email) ) {
        return res.status(400).json({ msg : "Not a valid email address"})
    }

    try {

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
            }
        });
        
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', 
            to: email,
            subject: "Hello ✔", 
            text: "Hello world?", 
            html: "<b>Hello world?</b>"
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