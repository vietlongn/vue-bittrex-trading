// server.js
// const path = require('path')
const moment = require('moment')
const express = require('express')
const { CronJob } = require('cron')
// const socketIO = require('socket.io')
// const serveStatic = require('serve-static')
const bittrex = require('node.bittrex.api')
const BittrexClient = require('bittrexjs').Client
const { MongoClient } = require('mongodb')

// const dbLocalUrl = 'mongodb://localhost:27017/market'
const dbServerUrl = 'mongodb://admin:882398@ds013971.mlab.com:13971/bittrex_market'
const serverPort = process.env.PORT || 8888
const bittrexClient = new BittrexClient()

let db
let fetchDone = true

bittrex.options({
  'verbose': true
})

MongoClient.connect(dbServerUrl, (err, database) => {
  if (err) {
    console.log('Can not connected')
  } else {
    db = database
  }
})

// Start the application after the database connection is ready
const app = express()

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.listen(serverPort, () => console.log(`Listening on ${serverPort}`))

// const wss = socketIO(app)

let insertLastestCandleJob = new CronJob({
  cronTime: '*/5 * * * *', // Every 5 mins
  onTick: updateCandleData,
  start: false,
  timeZone: 'Asia/Ho_Chi_Minh'
})

insertLastestCandleJob.start()

app.get('/candleData', (req, res) => {
  db.collection('candles').find().sort({marketName: 1}).toArray((err, docs) => {
    if (!err) {
      res.send(docs)
    } else {
      console.log('Error while getting data !!!', err)
    }
  })
})

// wss.on('connection', (client) => {
//   console.log('Connected from client', client.id)
//
//   client.on('getLatestCandle', () => {
//     console.log('-------- getMarkets -------')
//
//     // let stream = db.collection('candles').find().stream()
//     //
//     // stream.on('data', function (doc) {
//     //   client.send(doc)
//     // })
//     // stream.on('error', function (err) {
//     //   console.log(err)
//     // })
//     // stream.on('end', function () {
//     //   console.log('All done!')
//     // })
//   })
//
//   client.on('disconnect', () => {
//     console.log('Disconnect from client:', client.id)
//   })
// })

function updateCandleData () {
  if (fetchDone) {
    console.log('Fetching data ...')
    fetchDone = false

    bittrexClient.getMarketSummaries().then(data => {
      let btcMarket = (data && data.result.filter(d => /^BTC-.+$/.test(d.MarketName) && !/BTC-(TIME|TKN)/.test(d.MarketName))) || []
      let promise = Promise.resolve()

      btcMarket.forEach(item => {
        promise = promise.then(() => {
          return bittrexClient.getLatestCandle(item.MarketName, 'hour')
        }).then(data => {
          data && updateCandleHourTbl(data, item)
        })
      })

      promise.then(() => {
        console.log('Fetch done ...')
        fetchDone = true
      })
    })
  }
}

function updateCandleHourTbl (data, item) {
  data.result.forEach(d => {
    d.T = moment(d.T).add(7, 'hour').format('YYYY-MM-DD HH:mm:ss')
    d.CurrentTime = moment(d.T).format('YYYY-MM-DD')
  })

  db.collection('candle_hour').update(
    {
      marketName: item.MarketName,
      'result.T': data.result[0].T
    },
    {
      $set: {
        baseVolume: item.BaseVolume,
        'result.$': data.result[0]
      }
    })
}
