const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors');


app.use(cors())
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/api/persons/:id', (req, res) => {
    let id = req.params.id
    let person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})


app.post('/api/persons', (req, res) => {
    let person = {
        id: (Math.floor(Math.random() * 100000000) + 1).toString(),
        name: req.body.name,
        number: req.body.number
    }

    if (persons.some(p => p.name === person.name)) {
        res.status(400).json({ error: 'name must be unique' })
    } else if (person.name && person.number) {
        persons.push(person)
        res.json(person)
    } else {
        res.status(400).json({error: 'name or number missing'})
    }

    
})

app.delete('/api/persons/:id', (req, res) => {
    let id = req.params.id
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    let personNum = persons.length
    let date = new Date()

    res.send(`<p>Phonebook has info for ${personNum} people<p/>
                <p>${date}<p/>`)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})