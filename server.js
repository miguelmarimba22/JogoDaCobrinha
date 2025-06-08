const express = require("express")
const path = require("path")
const app = express()

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: path.join(__dirname)})
})

app.get("/JS", (req, res) => {
    res.sendFile("script.js", {root: path.join(__dirname)})
})

app.listen("3000", () => {
    console.log("funcionando")
})