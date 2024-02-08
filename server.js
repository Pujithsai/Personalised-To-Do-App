const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
require('dotenv').config();
const {default:mongoose} = require('mongoose');
const TodoUser = require('./models/TodoUser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secret = 'secret123';
const Todos = require('./models/Todos');

mongoose.connect(process.env.MONGO_URL);
const app = express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:'http://localhost:3000',
}));
app.use(body.json({extended:true}));
app.use(cookie());

app.get('/', (req,res) => {
    res.json('server is up and running');
});

app.post('/register',(req,res) => {
    const {email,password} = req.body;
    const newpassowrd = bcrypt.hashSync(password,10);
    TodoUser.create({
        email: email,
        password: newpassowrd,
    }).then(info => {
        jwt.sign({id:info._id,email:info.email},secret,(err,token)=>{
            if (err){
                console.error('Token Creation Error:', err);
                res.sendStatus(500);
            }else{
                console.log('Created Token:', token);
                res.cookie('token',token).json({id:info._id,email:info.email});
            }
        });
    });
});

app.post('/login',(req,res) => {
    const {email,password} = req.body;
    TodoUser.findOne({email})
    .then(userInfo => {
        if(userInfo){
            const passok = bcrypt.compareSync(password,userInfo.password);
            if (passok){
                jwt.sign({id:userInfo._id,email:userInfo.email},secret,(err,token) =>{
                    if (err){
                        console.error('Token Creation Error:', err);
                        res.sendStatus(500);
                    }else{
                        res.cookie('token',token).json({id:userInfo._id,email:userInfo.email});
                    }
                });
            }else{
                res.sendStatus(401);
            }
        }else{
            res.sendStatus(401)
        }
    });
});

app.get('/user',(req,res) => {
    const payload = jwt.verify(req.cookies.token,secret);
    TodoUser.findById(payload.id)
    .then(response => {
        res.json({id:response._id,email:response.email});
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').sendStatus(200);
});

app.put('/todos',(req,res) => {
    const payload = jwt.verify(req.cookies.token,secret);
    Todos.create({
        text: req.body.text,
        done: false,
        user: new mongoose.Types.ObjectId(payload.id),
    })
    .then(todo => {
        res.json(todo);
    });
})

app.get('/todos', (req, res) => {
    const payload = jwt.verify(req.cookies.token, secret);
    Todos.find({ user: new mongoose.Types.ObjectId(payload.id) })
        .exec()
        .then(todos => {
            res.json(todos);
        })
        .catch(err => {
            console.error('Error fetching todos:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/todos',(req,res)=>{
    const payload = jwt.verify(req.cookies.token, secret);
    Todos.updateOne({_id:new mongoose.Types.ObjectId(req.body.id),user:new mongoose.Types.ObjectId(payload.id)},{done:req.body.done})
    .then(() => {
        res.sendStatus(200)
    })
})


app.listen(4000);