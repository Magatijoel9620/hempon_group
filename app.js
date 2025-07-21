const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer"); // Optional for email
const favicon = require("serve-favicon");
const app = express();

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (ensure this path matches your deployment directory)
app.use(express.static(path.join(__dirname, "public")));

// Serve the favicon
app.use(favicon(path.join(__dirname, "public", "favicon.png")));

// Set EJS as the template engine
app.set("view engine", "ejs");

// Home page route
app.get("/", (req, res) => {
  res.render("index", { query: req.query });
});

app.get("/thank-you", (req, res) => {
  res.render("thank-you", { message: "Thank you for contacting us!" });
});

// Contact form route
app.post("/contact", (req, res) => {
  const { name, email, number, subject, message } = req.body;

  if (!name || !email || !message) {
    // Redirect to the home page with an error message
    return res.redirect("/?error=missing-fields");
  }

  // Example: Sending email (use environment variables for security)
  const transporter = nodemailer.createTransport({
    host: "mail.hempongroup.co.ke", // Replace with cPanel mail server (e.g., mail.yourdomain.com)
    port: 465, // Use SSL port for secure email
    secure: true, // Use SSL
    // auth: {
    //   user: "info@hempongroup.co.ke", // Replace with your cPanel email address
    //   pass: "magati@9620", // Replace with your email password
    // },
    auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
},
  });

  const mailOptions = {
    from: email,
    to: "info@hempongroup.co.ke", // Replace with your receiving email
    subject: `Contact Form: ${subject || "No Subject"}`,
    text: `Name: ${name}\nEmail: ${email}\nNumber: ${
      number || "Not provided"
    }\n\nMessage:\n${message}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      // Redirect to the home page with an error message
      return res.redirect("/?error=email-failed");
    }
    // Redirect to the home page with a success message
    res.redirect("/?success=message-sent");
  });
});
// Start the server on the cPanel-assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

