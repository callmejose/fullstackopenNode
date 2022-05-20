const express = require("express")
const morgan = require("morgan")

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const generateId = () =>
  Math.max(...phonebook.map(e => e.id)) + 1
// console.log('max id: ', generateId())

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const entrybook = phonebook.find(n => n.id === id)
  if (!entrybook) {
    response.status(400).json({
      error: 'content missing'
    })
    return
  }
  console.log('phone: ', String(entrybook.name))
  response.json(entrybook)
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

  if (phonebook.find(e => e.name === body.name)) {
    response.status(400).json({
      error: 'name must be inique'
    })
    return
  }

  const newEntry = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(newEntry)
  response.status(201).json(newEntry)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`app running on port ${PORT}`)