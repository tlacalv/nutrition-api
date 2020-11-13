//dotenv config
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.json())

app.post(
  '/login',
  (req, res) => {
    const body = req.body;
    console.log(body)
    res.json({ message: "success"})
  }
)
app.post(
  '/sign-in',
  (req, res) => {
    const body = req.body;
    console.log(body)
    res.json({ message: "success"})
    
  }
)

app.post(
  '/login',
  (req, res) => {
    const body = req.body;
    console.log(body)
    res.json({ message: "success"})
    
  }
)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running in: http://localhost:${PORT}`)
})