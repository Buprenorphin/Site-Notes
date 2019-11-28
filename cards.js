var express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var request = require('request')
var router = express.Router()

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Notes",
    multipleStatements: true
})

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get("/cards/:id", (req, res) => {
    try {
        const cardID = Number(req.params.id)
        if (isNaN(cardID)) {
            console.log("Result is empty");
            res.sendStatus(502)
            return
        }

        const query = "SELECT * FROM Card WHERE Card.id = ? LIMIT 1"
        connection.query(query, [cardID], (error, rows, fields) => {
            if (error) {
                console.log(error)
                res.sendStatus(500)
                return
            }
            if (rows.length === 0) {  // There were no items 
                console.log("Result is empty");
                res.sendStatus(404)
                return
            }

            var card = JSON.parse(JSON.stringify(rows))[0]
            
            request.get("http://localhost:5555/cards/" + cardID + "/tasks", { json: true }, (tasksError, tasksResponse, tasksBody) => {
                card.tasks = tasksBody
                res.json(card);
            })
        })
    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/cardsId", (req, res) => {
    try {
        const query = "SELECT id FROM Card"
        connection.query(query, (error, rows, fields) => {
            if (error) {
                console.log(error)
                res.sendStatus(500)
                return
            }

            var card = JSON.parse(JSON.stringify(rows))
            res.json(rows)
        })
    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/cards", (req, res) => {
    try {
        request.get("http://localhost:5555/cardsId/", { json: true }, (error, response, body) => {
            var count = 0
            var cards = new Array()
    
            body.forEach((item) => {
                request.get("http://localhost:5555/cards/" + item.id, { json: true }, (cardError, cardResponse, cardBody) => {
                    cards.push(cardBody)
                    count++;
    
                    if (count === body.length) {
                        res.send(cards)
                    }
                })
            })
    
        })
    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.post("/cards", (req, res) => {
    try {
        const data = req.body

        console.log(data);
        

        var query = "INSERT INTO Card(title) VALUE ('" + data.title + "'); "
        // var query = "INSERT INTO card(title, description) VALUE ('" + data.title + "', '" + data.description + "'); " +
        if (typeof data.tasks !== 'undefined' && Object.keys(data.tasks).length > 0) {
            query += "INSERT INTO Task(Task, CardId) VALUES "
            data.tasks.forEach((item, i) => {
                query += " ('" + item + "', (SELECT MAX(id) FROM Card)),"
            })
            query = query.replace(/,$/,"")
        }

        connection.query(query, (error, rows, fields) => {
            if (error) {
                console.log(error)
                res.sendStatus(500)
                return
            }

            
            var row = JSON.parse(JSON.stringify(rows))[0]
            if (typeof row === 'undefined') { 
                row = JSON.parse(JSON.stringify(rows))
            }
            
            request.get("http://localhost:5555/cards/" + row.insertId, { json: true }, (cardError, cardResponse, cardBody) => {
                if (error) {
                    console.log(error)
                    res.sendStatus(500)
                    return
                }
                res.send(cardBody)
            })

        })
    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.delete("/cards/:id", (req, res) => {
    try {
        const cardID = Number(req.params.id)
        if (isNaN(cardID)) {
            console.log("Result is empty");
            res.sendStatus(502)
            return
        }

        var query = "DELETE FROM Task WHERE Task.CardId = " + cardID + "; " +
        "DELETE FROM Card WHERE Card.id = " + cardID 
        connection.query(query, (error, rows, fields) => {
            if (error) {
                console.log(error)
                res.sendStatus(500)
                return
            } if (rows.length === 0) { // There were no items 
                console.log("Result is empty");
                res.sendStatus(404)
                return
            }
            
            res.sendStatus(200)
        })
    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
})


module.exports = router