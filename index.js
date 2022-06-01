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

app.get('/api/persons/:id', (request, response, next) => {
  Phone.findById(request.params.id).then(phone => {
    if (phone) {
      response.json(phone)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  let entries = 0
  Phone.find({}).then(phone => {
    entries = phone.length
    response.send(
      `<h1>Phonebook has info for ${entries} people</h1>
          <p>${new Date().toString()}</p>`
    )
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  // console.log('delete', id)
  Phone.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).json({
        status: 'content deleted'
      })
    })
    .catch(error => next(error))

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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  // console.log('updating...', body)

  if (!body.name || !body.number){
    response.status(400).json({
      error: 'missing name and/or number'
    })
    return
  }

  const phone = {
    name: body.name,
    number: body.number
  }

  Phone.findByIdAndUpdate(request.params.id, phone)
    .then(updatedPhone => {
      response.status(201).json(updatedPhone)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
 console.error(error.message)

 if (error.name === 'CastError') {
   return response.status(400).send({ error: 'malformatted id' })
 }

 next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`app running on port ${PORT}`)