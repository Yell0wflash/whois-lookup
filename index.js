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
const PORT = process.env.PORT || 8080;
app.use(bodyParser());
app.set("json spaces", 2);
app.use(log("dev"));
app.use(express.static(ROOT));
app.set("view engine", "ejs");
app.set("views", VIEW_ROOT);
let cache = {}

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
  //  if (cache[query]) return res.render("result", { query, result: cache[query] });
    let result = (await whois(query)).trim();
  //  cache[query] = result;
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
  //  if (cache[query]) return res.send(cache[query].trim());
    let result = await whois(query);
  //  cache[query] = result;
    res.send(result.trim());
  } catch (e) {
    res.status(500).send("Error: "+e.message);
    console.log(e);
  }
})

app.use((req, res, next) => {
  res.sendStatus(404);
});

const listener = app.listen(PORT);

console.log(
  "[ EXPRESS ] Your app listen on port " + listener.address()?.port || 443
);
