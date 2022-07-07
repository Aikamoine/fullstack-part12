const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  let amount = await redis.getAsync('added_todos')

  if (amount === null) {
    await redis.setAsync('added_todos', 1)
  } else {
    await redis.setAsync('added_todos', Number(amount) + 1)
  }

  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  console.log('täällä käytiin')
  console.log('req', req.todo)
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  console.log('täsä')
  res.json(req.todo) // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.todo._id,
    req.body,
    {
      new: true
    }
  )
  res.send(updated)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
