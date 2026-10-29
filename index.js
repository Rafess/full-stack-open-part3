
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
// app.use(morgan('tiny'))
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status - Body: :body'));

let persons = [
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
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  console.log('persons: ', persons)
  response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((p)=> 
        p.id === id
    )
    
    if(!person) {
        return response.status(404).end()
    }
  response.json(person)
})
app.get('/api/info', (request, response) => {
    const now = new Date()
    console.log(now)
    const personsTotal = persons.length
    response.send(`<p>Phonebook has info for ${personsTotal} people</p>
        <p>${now.toString()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name and number are required' 
    })
  }
  const names = persons.map((p) => p.name)
  
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 99),
  }
  const isNameUsed = names.find((n) => {
    return n === person.name
  })
if(isNameUsed) {
    return response.status(409).json({
        "error": "name must be unique"
    })
}
persons = persons.concat(person)
  console.log('persons ', person)
response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
