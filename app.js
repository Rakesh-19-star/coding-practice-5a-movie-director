const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
const dbpath = path.join(__dirname, 'moviesData.db')

const app = express()
let db = null
app.use(express.json())

const initAndStartServer = async () => {
  try {
    db = await open({filename: dbpath, driver: sqlite3.Database})
    app.listen(3000, () => {
      console.log('server is running at http://localhost:3000')
    })
  } catch (e) {
    console.log(`DB ERRoR: ${e.message}`)
    process.exit(1)
  }
}
initAndStartServer()
//api 1
app.get('/movies/', async (request, response) => {
  const getmoviesQuery = `
   SELECT * FROM movie;
  `
  const movieList = await db.all(getmoviesQuery)
  response.send(movieList)
})

//api 2 adding a movie
app.post('/movies/', async (request, response) => {
  const movieDetais = request.body
  const {director_Id, movie_Name, lead_Actor} = movieDetais
  const addingMovieQuery = ` 
    INSERT INTO movie (director_id, movie_name,lead_actor)
    VALUES
    (
      ${director_Id},
      '${movie_Name}',
      '${lead_Actor}'
      
    )
  `
  const dbresponse = await db.run(addingMovieQuery)
  response.send('Movie Successfully Added')
})

//get movie base on its id
app.get('/movies/:moviesId/', async (request, response) => {
  const {moviesId} = request.params
  const getmovieIdQuery = `
    SELECT * FROM movie WHERE  movie_id  =${moviesId};
  `
  const movieList = await db.get(getmovieIdQuery)
  response.send(movieList)
})

//api upading movie deatils

app.put('/movies/:moviesId/', async (request, response) => {
  const {moviesId} = request.params
  const movieDetais = request.body
  const {director_Id, movie_Name, lead_Actor} = movieDetais
  const updateMovieQuery = ` 
    UPDATE  movie SET 
    director_id=${director_Id},
    movie_name='${movie_Name}',
    lead_actor='${lead_Actor}'
    WHERE movie_id=${moviesId}
   `
  const dbresponse = await db.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

//deleting a movie
app.delete('/movies/:moviesId/', async (request, response) => {
  const {moviesId} = request.params

  const deleteMovieQuery = ` 
    DELETE  FROM  movie  
    
    WHERE movie_id=${moviesId}
   `
  const dbresponse = await db.run(deleteMovieQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getdirectorsQuery = `
   SELECT * FROM director;
  `
  const movieList = await db.all(getdirectorsQuery)
  response.send(movieList)
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getmovieIdQuery = `
    SELECT * FROM movie WHERE  director_id  =${directorId};
  `
  const movieList = await db.get(getmovieIdQuery)
  response.send(movieList)
})
