const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// applocation/json
app.use(bodyParser.json());
const mongoose = require('mongoose')
 mongoose.connect('mongodb+srv://shia:rnjsgydms84!@cluster0.ytazsaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    // mongoose 6버전 이상에선 더이상 useNewUrlParser, useUnifiedTopology, useFindAndModify, useCreateIndex 요 친구들을 지원하지 않기 때문에 지워주면 된다
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! 안녕~~~실시간으로 보여줘')
})

app.post('/register', async (req, res) => {
    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    await user .save() .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        success: false,
        err: err,
      });
    });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})