const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;
admin.initializeApp();

//creating function for sending emails
var goMail = function (message) {
  //transporter is a way to send your emails
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      type: "login", // default
      user: gmailEmail,
      pass: gmailPassword,
    },
  });

  //this is how your email are going to look like
  const mailOptions = {
    from: "josevegaraquel@gmail.com",
    to: "jocvegar@gmail.com",
    subject: "Mensaje de la Página Web",
    text:
      message +
      "Check out console: https://console.firebase.google.com/u/0/project/josevega-portfolio/overview", // plain text body
    html:
      message +
      "Check out console: https://console.firebase.google.com/u/0/project/josevega-portfolio/overview", // html body
  };

  //this is callback function to return status to firebase console
  const getDeliveryStatus = function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  };

  //call of this function send an email, and return status
  transporter.sendMail(mailOptions, getDeliveryStatus);
};

//.sendEmail is watches for changes in database
exports.sendEmail = functions.firestore
  .document("messages/{messageId}")
  .onCreate(function (snap, context) {
    //here we catch a new data, added to firebase database, it stored in a snap variable
    // const createdData = snap.data();
    // var text = createdData.message;

    //here we send new data using function for sending emails
    goMail("Someone is trying to talk us :) ");
  });
