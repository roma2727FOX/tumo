import express from "express";
import {appendFileSync} from 'fs';
const app = express()

app.use(express.static('./'));
app.use(express.json())

app.post("/stats", (req, res) =>{
    appendFileSync('static.txt', JSON.stringify(req.body) + "\n")
})

app.listen(3000, ()=> {
    console.log("OK")
}); 