const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config()


const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})


app.get('/api/persons/:id', (req, res, next) => {
    let id = req.params.id
    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})


app.post('/api/persons', (req, res, next) => {

    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })

    person.save()
    .then(saved => res.json(saved))
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
    let id = req.params.id
    Person.findByIdAndDelete(id).then(result => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        let date = new Date()
        let personNum = persons.length
        res.send(`<p>Phonebook has info for ${personNum} people<p/>
            <p>${date}<p/>`)
    })
})


app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformated id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})