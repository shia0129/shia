const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
const { auth } = require("./middleware/auth");
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

app.post("/api/users/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      err: err,
    });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    // 요청된 이메일을 데이터베이스에서 찾는다.
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀본호가 맞는 비밀번호인지 확인.
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    // 비밀번호까지 맞다면 토큰을 생성하기.
    const tokenUser = await user.generateToken();
    // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
    res
      .cookie("x_auth", tokenUser.token)
      .status(200)
      .json({ loginSuccess: true, userId: tokenUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// role 1 어드민 role 2 특정 부서 어드민
// role 0 -> 일반유저 role 0이 아니면 관리자
app.get("/api/users/auth", auth, (req, res) => {
  // 여기 까지 미들웨어를 통과해 왔다는 애기는 Authentication이 True 라는 말.

  res.status(200).json({
    _id: req.user_id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user,
    email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
