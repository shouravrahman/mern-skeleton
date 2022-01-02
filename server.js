require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const dbConnect = require('./utils/db')
const app = express()

// app.use(cors())
// app.use(cors())
// app.use(cors({ origin: true, credentials: true }))
// app.use(cookieParser(process.env.COOKIE_KEY))
app.use(cookieParser())

const corsOptions = {
	origin: true, //included origin as true
	credentials: true, //included credentials as true
}

app.use(cors(corsOptions))
app.use(express.json())

app.use(
	fileUpload({
		useTempFiles: true,
	})
)

//db connect
dbConnect()

//routes
app.use('/auth', require('./routes/auth-routes'))
app.use('/users', require('./routes/user-routes'))
app.use('/upload', require('./routes/uploadImage-route'))

const port = process.env.PORT || 5000

// app.get('/', (req, res) => res.send('Hello nigga'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
