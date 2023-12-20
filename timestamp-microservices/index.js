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

app.get("/api/:date_string?", (req, res) => {
  const { date_string } = req.params;

  if (!date_string) {
    // If date_string is empty, return the current time
    const currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString(),
    });
  }

  let date = new Date(date_string);

  if (date.toString() === "Invalid Date") {
    date = new Date(parseInt(date_string));
  }

  if (date.toString() === "Invalid Date") {
    return res.json({
      error: "Invalid Date",
    });
  } else {
    return res.json({
      unix: date.getTime(),
      utc: date.toUTCString(),
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});