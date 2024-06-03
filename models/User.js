const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //띄어쓰기 방지
        unique: 1, //같은 이메일 중복 방지
    },
    password: {
        type: String,
        maxlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, // 사용자 권한 숫자로 주기
        default: 0 //임의로 롤을 주지 않으면 0을 주겠다.
    },
    image: String,
    token: { //유효성관리
        type: String
    },
    tokenExp: { //쓸수 있는 유효기간
        type: Number
    }

})

const User = mongoose.model('User', userSchema)

module.exports = {User} //다른 곳에서 쓸수 있게 하기