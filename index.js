const path = require("path");
const express = require("express");
const app = express();
const util = require("util");
const whois = util.promisify(require("whois").lookup);
var bodyParser = require("body-parser");
const log = require("morgan");
const ROOT = path.join(__dirname, "public");
const VIEW_ROOT = path.join(__dirname, "pages");
// const path = require("path");
require("dotenv").config();
const PORT =
  process.env.PORT ||
  String(Math.floor(Math.random() * 9)) +
    String(Math.floor(Math.random() * 9)) +
    String(Math.floor(Math.random() * 9)) +
    String(Math.floor(Math.random() * 9));
app.use(bodyParser());
app.set("json spaces", 2);
app.use(log("dev"));
app.use(express.static(ROOT));
app.set("view engine", "ejs");
app.set("views", VIEW_ROOT);

app.use((req, res, next) => {
  res.locals.hostname = req.hostname;
  next();
});

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/whois/:query", async (req, res, next) => {
  let { query } = req.params;
  try {
    let result = (await whois(query)).trim();
    res.render("result", { query, result });
  } catch (e) {
    res.render("result", { query, result: "Error : " + e.message });
    console.log(e);
  }
});

app.get('/api/whois/:query', async (req, res, next) => {
let { query } = req.params;
res.type("text/plain");
try {
    let result = await whois(query);
    res.send(result.trim());
  } catch (e) {
    res.status(500).send("Error: "+e.message);
    console.log(e);
  }
})

app.use((req, res, next) =>
  res.status(404).send(`<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>Express/${require("express/package").version} (${require("os").hostname()})</center>
</body>
</html>`)
);

const listener = app.listen(PORT);

console.log(
  "[ EXPRESS ] Your app listen on port " + listener.address()?.port || 443
);
