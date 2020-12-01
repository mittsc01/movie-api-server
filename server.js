require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

const MOVIES = require('./MOVIES.json')

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req,res,next){
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if (!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).send({error: 'unauthorized request'})
    }
    next()
})

function handleGetMovies(req,res){
    let response = MOVIES
    const {genre="", country="", avg_vote=null} = req.query

    if (genre){
        response = response.filter(movie=>movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }
    if (country){
        response = response.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
    }
    if (avg_vote){
        if (parseFloat(avg_vote) == NaN){
            return (res.status(400).send('avg vote needs to be a number'))
        }
        response = response.filter(movie => movie.avg_vote >= avg_vote)
    }
    return res.json(response)




    res.send(MOVIES[0])
}

app.get('/movie',handleGetMovies)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})