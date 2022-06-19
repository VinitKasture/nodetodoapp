const express = require('express');
const router = express.Router();

//User model
const User = require('../models/User')


router.post('/addtodo', async(req, res) => {
    const email = req.cookies["email"];
    const todo = req.body.todo;
    const newTodo = {
        _id: new Date().toString(),
        todo: todo,
        createdAt: new Date().toString()
    }
    await User.findOneAndUpdate({ email }, {
        $push: {
            todos: newTodo
        }
    })
    res.redirect('/dashboard')
})

router.get('/delete/:id', async(req, res) => {
    const email = req.cookies["email"];
    const id = req.params.id;
    const user = await User.findOne({ email });
    await User.findOneAndUpdate({ email }, {
        $push: {
            archives: user.todos[id]
        },
        $pull: {
            todos: user.todos[id]
        }
    });
    res.redirect('/dashboard')
})

router.get('/edit/:id', async(req, res) => {
    const email = req.cookies["email"];
    const id = req.params.id;
    const user = await User.findOne({ email });
    const todos = user.todos;
    const todo = user.todos[id];
    res.render('update', { todos, todo })
})

router.get('/update/:id', async(req, res) => {
    const email = req.cookies["email"];
    const id = req.params.id;
    const user = await User.findOne({ email });
    let todo = user.todos[id]
    const todoText = req.query.newtodo;
    const newTodo = {
        _id: new Date().toString(),
        todo: todoText,
        createdAt: new Date().toString()
    }
    await User.findOneAndUpdate({ email }, { todos: newTodo });
    res.redirect('/dashboard')
})

router.get('/archives', async(req, res) => {
    const email = req.cookies["email"];
    const user = await User.findOne({ email });
    const archives = user.archives;
    res.render('archives', { archives })
})

router.get('/cleararchives', async(req, res) => {
    const email = req.cookies["email"];
    const user = await User.findOne({ email });
    const archives = user.archives;
    for (let i = 0; i < archives.length; i++) {
        await User.findOneAndUpdate({ email }, {
            $pull: {
                archives: user.archives[i]
            }
        });
    }
    res.redirect('/dashboard')
})

router.get('/chart', async(req, res) => {
    const email = req.cookies["email"];
    const user = await User.findOne({ email });
    const archives = user.archives.length;
    const todos = user.todos.length;
    const todoData = [todos, archives]
    res.render('chart', { todoData })
})

module.exports = router;