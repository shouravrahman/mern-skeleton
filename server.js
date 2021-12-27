require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const app = express()

app.use(express.json())
app.use(cors())
app.use(
    fileUpload({
        useTempFiles: true,
    })
)

//db connect
const URI = process.env.MONGO_URI

mongoose.connect(URI, {}, (err) => {
    if (err) throw err

    console.log('database connected')
})
//routes
app.use('/users', require('./routes/user-routes'))
app.use('/api', require('./routes/uploadImage-route'))

const port = process.env.PORT || 5000

// app.get('/', (req, res) => res.send('Hello nigga'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))