const express = require('express');
const req = require('express/lib/request');
const app = express()
const port = 5000;


const mongoose = require('mongoose')
const MONGODB_URL = 'mongodb+srv://accguy:root@clusterda.0yaeq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' 

mongoose.connect(MONGODB_URL)  
.then(() => console.log('MongoDB Connected..........!!!'))
.catch(err => console.log(err))


app.get('/', (req, res) => res.send('ㅎㅇㅎㅇㅎㅇㅎㅇ'))
app.listen(port, () => console.log('Example app listening on port',port))