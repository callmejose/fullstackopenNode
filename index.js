const express = require("express")
const app = express()

const phonebook = [
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

const PORT = 3001
app.listen(PORT)
console.log(`app running on port ${PORT}`)