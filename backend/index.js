const bodyParser = require("body-parser");
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require('multer');
const cors = require('cors');
require('dotenv').config(); // Add this line

const app = express();

// Use the cors middleware with specific origins
app.use(cors({
  origin: ['http://localhost:3000'], // replace with your frontend's URL in production
  methods: ['GET', 'POST'],
  credentials: true,
}));

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'dikshabuxani84745@gmail.com',
      pass: process.env.EMAIL_PASS, //app password created using 2 step verification 
    },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send("route");
});

app.post('/send-email', upload.single('pdf'), (req, res) => {
    const { name, email, number } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email with PDF',
        text: `Hello ${name},\n\nPhone Number:${number}\n\nPlease find the attached PDF file.`,
        attachments: [
            {
                filename: 'document.pdf',
                content: req.file.buffer,
                encoding: 'base64',
            }
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running at port ${PORT}`);
});
