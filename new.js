const express = require("express");
const Bodyparser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require("nodemailer");

const app = express();

app.use(Bodyparser());

const PORT = process.env.PORT || 6500;
app.listen(PORT, console.log(`Listening on PORT ${PORT}...`));

app.post("/api/email", async (req, res) => {

    let testAccount = await nodemailer.createTestAccount();
    let name = req.body.name;
    let from = req.body.from;
    console.log('=================from===================');
    console.log({name, from});
    console.log('=================from===================');
    let subject = req.body.subject;
    let message = req.body.message;
    let env = req.body.env;
    // let to = "asim.raza@techchefz.com, akshay.sharma1806@gmail.com";

    let receiver = ['gautam.mehta@techchefz.com', "akshay.sharma1806@gmail.com"];

    const check = /@techchefz.com/g;
    const users =  ['asim.raza@techchefz.com','gautammehta648@gmail.com', check.test(receiver)];
    if (env != "production") {
      staticMailOptions = {
        name: name, // sender name
        from: from, // sender address
        to: users,  // list of receivers
        subject: subject, // Subject line
      }
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.pepipost.com",
        port: 587,
        auth: {
            user: 'royalenfield',
            pass: 'Smtp@2018',
        },
       tls:{ rejectUnauthorized: false }
    });

    // let options = {
    //     from,
    //     to,
    //     subject,
    // };

    ejs.renderFile(__dirname + "/html.ejs", {data: staticMailOptions}, async (err, data) => {
        if (err) {
            console.log(err);
        } else {
                // send mail with defined transport object
                let info =  await transporter.sendMail({
                from: from, // sender address
                to: users,     // list of receivers
                subject: subject,  // subject line
                text: message,     // plain text body
                html: data         // html body
            });
            console.log('================infooooo====================');
            console.log({info});
            console.log('================infooooo====================');
            console.log(info.subject);
            
            transporter.sendMail(info, (error, response) => {
                if(error){
                    console.log(error);
                }else{
                    res.redirect('/');
                }
            });
        }
    });
});