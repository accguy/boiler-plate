const express = require('express')
const app = express()
const port = 5000

const req = require('express/lib/request')
const res = require('express/lib/response')

const bodyParser = require('body-parser')
const { User } = require('./models/User')
const config = require('./config/key') 


//application/x-www-form-urlencoded (해당 형태의 데이터를 분석해서 가져올수 있도록 해줌)
app.use(bodyParser.urlencoded({extended: true}))

//application/json
app.use(bodyParser.json())


const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URL)
.then(() => console.log('MongoDB Connected..........!!!'))
.catch(err => console.log(err))


app.get('/', (req, res) => res.send('This is main page.'))

app.get('/mg', function(req, res){
    res.send("This is mg page.")
})

app.post('/register', (req, res) => {
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

app.listen(port, () => console.log('Example app listening on port',port))