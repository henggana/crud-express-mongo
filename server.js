const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

const mongodbUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'star-wars-quotes'

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

MongoClient.connect(mongodbUrl, { useNewUrlParser: true })
.then(client => {
  const db = client.db('starwars-quotes')
  const quoteCollection = db.collection('quotes')

  app.get('/', (req, res) => {
    db.collection('quotes').find().toArray()
      .then(results =>  {
        console.log(results)
        res.render('index.ejs', { quotes: results })
      })

  })

  app.post('/quotes', (req, res) => {
    console.log(req.body)
    quoteCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
      .catch(console.error)
  })

  app.put('/quotes', (req, res) => {
    quoteCollection.findOneAndUpdate(
      { name: 'Yoda' },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote,
        },
      },
      {
        upsert: true,
      },
    )
    .then(result => {
      res.json('Success')
    })
    .catch(console.error)
  })

  app.delete('/quotes', (req, res) => {
    quoteCollection.deleteOne(
      { name: req.body.name },
    )
    .then(result => {
      if (result.deletedCount === 0) {
        return res.json('No quote to delete')
      }
      res.json(`Deleted Darth Vadar's quote`)
    })
    .catch(console.error)
  })
})
.catch(console.error)


app.listen(3000, function() {
  console.log('listening on 3000')
})
