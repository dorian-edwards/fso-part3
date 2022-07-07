const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001

const persons = [
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

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
