const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
var mandrill = require("mandrill-api");

dotenv.config({ path: "./config/config.env" });
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL);

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Put all API endpoints under '/api'
app.post("/", (req, res) => {
  console.log(req.body);
  var text =
    "<p><ul><li>Name: " +
    req.body.emailBody.name +
    "</li><li>Amount: " +
    req.body.emailBody.amount +
    "</li><li>Email: " +
    req.body.emailBody.email +
    "</li><li>Message: " +
    req.body.emailBody.message +
    "</li></ul></p>";
  var message = {
    html: text,
    text: text
      .replace("<p>", "")
      .replace("</p>", "")
      .replace("<ul>", "")
      .replace("</ul>", "")
      .replace("<li>", "")
      .replace("</li>", ""),
    subject: req.body.modalStyle === "aid" ? "Mutual Aid request" : "Offer",
    from_email: "me@kassmanben.com",
    from_name: req.body.emailBody.name,
    to: [
      {
        email: "help@beanrelief.com",
        name: "Aid",
        type: "to",
      },
    ],
  };
  var async = false;
  var ip_pool = "Main Pool";
  mandrill_client.messages.send(
    {
      message: message,
      async: async,
      ip_pool: ip_pool,
    },
    () => {
      res.json({ successMessage: "success" });
    },
    function (err) {
      console.log(
        "A mandrill error occurred: " + err.name + " - " + err.message
      );
    }
  );
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} on port ${PORT}`)
);
