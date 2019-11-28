var express = require("express");
var app = express();

app.use(express.static('./client'))

var cards = require("./cards.js");
app.use(cards)

var tasks = require("./tasks.js");
app.use(tasks)

app.listen(5555, function() {
    console.log("Server is started");
    
})