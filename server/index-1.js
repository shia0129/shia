const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected.."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! ~~~. ");
});

app.post("/register", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
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

  // user.save((err, userInfo) => {
  //   if (err) return res.json({ success: false, err });
  //   return res.status(200).json({
  //     success: true,
  //   });
  // });
});

// app.post("/login", (req, res) => {
//   // 요청된 이메일을 데이터베이스에서 찾는다.
//   User.findOne({ email: req.body.email }, (err, user) => {
//     if (!user) {
//       return res.json({
//         loginSuccess: false,
//         message: "제공된 이메일에 해당하는 유저가 없습니다.",
//       });
//     }
//     // 요청된 이메일이 데이터베이스에 있다면 비밀본호가 맞는 비밀번호인지 확인.
//     user.comparePassword(req.body.password, (err, isMatch) => {
//       if (!isMatch)
//         return res.json({
//           loginSuccess: false,
//           message: "비밀번호가 틀렸습니다.",
//         });
//       // 비밀번호까지 맞다면 토큰을 생성하기.
//       user.generateToken((err, user) => {
//         if (err) return res.status(400).send(err);
//         // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
//         res
//           .cookie("x_auth", user.token)
//           .status(200)
//           .json({ loginSuccess: true, userId: user._id });
//       });
//     });
//   });
// });
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    const tokenUser = await user.generateToken();
    res
      .cookie("x_auth", tokenUser.token)
      .status(200)
      .json({ loginSuccess: true, userId: tokenUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
