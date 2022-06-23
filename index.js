const express = require('express')
const app = express()
const port = 5000

const req = require('express/lib/request')
const res = require('express/lib/response')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key') 

const { auth } = require('./middleware/auth')
const { User } = require('./models/User')

app.use(bodyParser.urlencoded({extended: true})) //application/x-www-form-urlencoded (해당 형태의 데이터를 분석해서 가져올수 있도록 해줌)
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URL)
.then(() => console.log('MongoDB Connected..........!!!'))
.catch(err => console.log(err))


app.get('/', (req, res) => res.send('This is main page.'))

app.get('/mg', function(req, res){
    res.send("This is MG page.")
})

app.post('/api/users/register', (req, res) => {
    //회원가입할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err}) //err:11000 똑같은 이메일로 두번 보내면 생기는 에러 unique: 1
        res.send("회원가입에 성공하셨습니다.")
        return res.status(200).json({
        success: true
        })
    })
})

app.post('/api/users/login', (req,res) => {

    //요청된 이메일이 DB에 존재하는지 확인
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            //비밀번호가 틀린 경우
            if(!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            }
            //비밀번호가 맞으면 토큰생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                //토큰을 쿠키에 저장
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id})    
            })
        })    
    })
})

app.get('/api/users/auth', auth, (req,res) => {
    // 여기까지 왔다면 MIDDLEWARE AUTH를 통과해 인증에 성공했다는 뜻임
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
            if(err) return res.json({ success: false, err});
            return res.status(200).send({ success: true });
        })
})

app.listen(port, () => console.log('Example app listening on port',port))