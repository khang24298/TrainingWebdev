var express = require('express');
var router = express.Router();
var { Todos, Users} = require("../database/schema/index");

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let todos = await Todos.find({createdBy: req.user.id});
    res.render("index", { todos });
  } catch (error) {
    next();
  }
});

/** POST: save activy */
router.post('/', async (req, res, next) => {
  try {
    // Get value form client.
    let activity = req.body.activity;

    let userId = req.user.id;

    // Create a todo object.
    let todo = {
      activity: activity,
      status: false,
      createdBy: userId
    }

    // Save todo to database.
    await Todos.create(todo);

    return res.redirect('/');
  } catch (error) {
    next();
  }
});

// Delete todo.
router.post('/delete', async (req, res, next) => {
  try {
    let id = req.body.id;
    console.log(id);
    let deletedTodo = await Todos.findById(id);
    deletedTodo.delete();
    return res.redirect('/');
  } catch (error) {
    next();
  }
});

// Change status todo => done.
router.post('/done', async (req, res, next) => {
  try {
    let id = req.body.id;
    console.log(id);
    let doneTodo = await Todos.findById(id);
    doneTodo.status = true;
    doneTodo.save();
    
    return res.redirect('/?done=true');
  } catch (error) {
    next();
  }
});

module.exports = router;
