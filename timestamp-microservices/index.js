// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date?", (req, res) => {
  const date = req.params.date;
  // res.json({date: date})
  const unix = new Date(date).getTime();
  const utc = new Date(date).toUTCString();
  if (unix) {
    res.json({ unix: unix, utc: utc });
  } else if (utc) {
    res.json({ unix: Date.parse(utc), utc: utc });
  } else {
    res.json({ error: "Invalid Date" });
  }
});

app.get("/api/:timestamp?", (req, res) => {
  const timestamp_ = parseInt(req.params.timestamp);
  res.json({timestamp: timestamp});
  // const timestampNumber = +timestamp; // or parseInt(timestamp, 10);

  // if (!isNaN(timestampNumber)) {
  //   const utc = new Date(timestampNumber).toUTCString();
  //   res.json({ unix: timestampNumber, utc: utc });
  // } else {
  //   res.json({ error: "Invalid Date" });
  // }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});