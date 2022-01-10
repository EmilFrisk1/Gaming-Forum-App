const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const blogRoutes = require('./routes/blog')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors({
    origin: '*'
}))

const PORT = process.env.PORT || 5000
const dbURI =  `mongodb+srv://eemeli123:${process.env.DB_PASSWORD}@cluster0.3ujv5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(PORT, () => console.log('Connection to DB successfull, listening at port 5000....')))
    .catch(err => console.log(err))

app.use(authRoutes)
app.use(blogRoutes)
