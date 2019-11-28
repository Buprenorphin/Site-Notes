const express = require('express')
const mysql = require('mysql')
const request = require('request')
const router = express.Router()

const connection =  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Notes",
    multipleStatements: true
})

router.get("/cards/:cardId/tasks", (req, res) => {
    try {
        const cardID = Number(req.params.cardId)

        const query = "SELECT * FROM Task WHERE Task.CardId = ?"
        connection.query(query, [cardID], (error, rows, fields) => {
            if (error) {
                console.log(error)
                res.sendStatus(500)
                return
            }
            res.json(rows)
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});


router.put("/cards/:cardId/tasks/:taskId", (req, res) => {
    try {
        const cardID = Number(req.params.cardId)
        const taskID = Number(req.params.taskId)
        const data = req.body


        if (isNaN(cardID) || isNaN(taskID)) {
            console.log("Result is empty");
            res.sendStatus(502)
            return
        }

        var query = "UPDATE Task SET Task = '" + data.title + "' WHERE CardId = " + cardID + " AND id = " + taskID
        connection.query(query, (error, rows, fields) => {
            if (error) {
                console.log(error)
                res.sendStatus(500)
                return
            }
            res.sendStatus(200)
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


router.delete("/cards/:cardId/tasks/:taskId", (req, res) => {
    try {
        const cardID = Number(req.params.cardId)
        const taskID = Number(req.params.taskId)

        if (isNaN(cardID) || isNaN(taskID)) {
            console.log("Result is empty");
            res.sendStatus(502)
            return
        }

        var query = "DELETE FROM Task WHERE Task.CardId = ? AND Task.id = ?"
        connection.query(query, [cardID, taskID], (error, rows, fields) => {
            if (error) {
                console.log(error)
                res.sendStatus(500)
                return
            }
            res.sendStatus(200)
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


module.exports = router