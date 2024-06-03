const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
 mongoose.connect('mongodb+srv://shia:rnjsgydms84!@cluster0.ytazsaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    // mongoose 6버전 이상에선 더이상 useNewUrlParser, useUnifiedTopology, useFindAndModify, useCreateIndex 요 친구들을 지원하지 않기 때문에 지워주면 된다
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! 안녕~~~ 안녕하세요~~~')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})