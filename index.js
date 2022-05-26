const express = require('express')
const auth = require('./routes/auth')
const post = require('./routes/post')

const app = express()

app.use(express.json())
app.use('/auth', auth)
app.use('/posts', post)





app.listen(4000, () => console.log('listening to port 4000'))