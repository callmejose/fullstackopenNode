require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Phone = require("./models/phone")
const phone = require('./models/phone')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('newEntry', (req) => {
  if (req.body.name && req.body.number) {
    return `{"name":"${req.body.name}","number":"${req.body.number}"}`
  }
  return ''
})
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :newEntry'
))

app.get('/api/persons', (request, response) => {
  // console.log(JSON.stringify(phonebook))
  Phone.find({}).then(phone => {
    response.json(phone)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Phone.findById(request.params.id).then(phone => {
    response.json(phone)
  })
})

app.get('/info', (request, response) => {
  response.send(
    `<h1>Phonebook has info for ${phonebook.length} people</h1>
        <p>${new Date().toString()}</p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // console.log('delete', id)
  phonebook = [...phonebook.filter(e => e.id !== id)]
  response.status(204).json({
    status: 'content deleted'
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  // console.log(body)

  if (!body.name || !body.number) {
    response.status(400).json({
      error: 'missing name and/or number'
    })
    return
  }

  // if (phonebook.find(e => e.name === body.name)) {
  //   response.status(400).json({
  //     error: 'name must be inique'
  //   })
  //   return
  // }

  const phone = new Phone({
    name: body.name,
    number: body.number
  })
  phone.save().then(savedPhone => {
    response.status(201).json(savedPhone)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`app running on port ${PORT}`)