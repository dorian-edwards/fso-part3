const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

function generateID() {
  return Math.floor(Math.random() * 2 ** 52)
}

morgan.token('data', (req, res) => {
  return Object.keys(req.body).length !== 0 && JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.get('/info', (req, res) => {
  const count = persons.length
  const date = new Date().toString()

  const conjugate = count === 1 ? 'person' : 'people'
  res.send(
    `<p>Phone book has info for ${count + ' ' + conjugate}</p><p>${date}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'incomplete Entry',
    })
  }

  if (persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase())) {
    return res.status(400).json({
      error: 'name must be unique',
    })
  }

  const newPerson = {
    id: generateID(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson)
  return res.status(201).json(newPerson)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((p) => p.id === id)

  if (!person) return res.status(404).send('<p>404 Not found</p>')
  res.json(person)
})

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((p) => p.id === id)

  if (!person) return res.status(404).end()

  const newNumber = req.body.number
  const newPerson = { ...person, number: newNumber }

  persons = persons.map((p) => (p.id !== id ? p : newPerson))
  return res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((p) => p.id !== id)
  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
