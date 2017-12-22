// server-backup.js
const path = require('path')
const moment = require('moment')
const express = require('express')
const { CronJob } = require('cron')
const bittrex = require('node.bittrex.api')
const serveStatic = require('serve-static')
const BittrexClient = require('bittrexjs').Client
const { MongoClient } = require('mongodb')

// const dbLocalUrl = 'mongodb://localhost:27017/market'
const dbServerUrl = 'mongodb://admin:882398@ds013971.mlab.com:13971/bittrex_market'
const serverPort = process.env.PORT || 9999
const bittrexClient = new BittrexClient()
const router = express.Router()

let db

let insertLastestCandleJob = new CronJob({
  cronTime: '*/1 * * * *', // Every 1 min
  onTick: insertCandleData,
  start: false,
  timeZone: 'Asia/Ho_Chi_Minh'
})

bittrex.options({
  'verbose': true
})

MongoClient.connect(dbServerUrl, (err, database) => {
  if (err) {
    console.log('Can not connected')
  } else {
    db = database

    insertLastestCandleJob.start()
  }
})

// Start the application after the database connection is ready
const app = express()

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

app.use(serveStatic(path.join(__dirname, '/dist')))
  .listen(serverPort, () => console.log(`Listening on ${serverPort}`))

app.use('/api', router)

// Get hourly data in day of all markets
router.route('/markets')
  .get((req, res) => {
    let responseData = []

    db.collection('candle_hour').find().sort({marketName: 1}).toArray((err, data) => {
      if (!err) {
        responseData = data.map(market => {
          return Object.assign({}, {
            marketName: market.marketName,
            baseVolume: +market.baseVolume.toFixed(0),
            result: market.result
          })
        })

        res.send(responseData)
      } else {
        console.log('Error while getting data !!!', err)
      }
    })
  })

// Get hourly data in day of markets following
router.route('/markets-following')
  .get((req, res) => {
    let marketNames = req.query.marketNames || []
    let responseData = []

    db.collection('candle_hour').find({marketName: { $in: marketNames }}).sort({marketName: 1}).toArray((err, data) => {
      if (!err) {
        responseData = data.map(market => {
          return Object.assign({}, {
            marketName: market.marketName,
            baseVolume: +market.baseVolume.toFixed(0),
            result: market.result
          })
        })

        res.send(responseData)
      } else {
        console.log('Error while getting data !!!', err)
      }
    })
  })

// Get detail hourly of market by name
router.route('/markets/:marketName/hourly')
  .get((req, res) => {
    let marketName = req.params.marketName || ''

    bittrex.getcandles({marketName: marketName, tickInterval: 'hour'}, data => {
      if (data) {
        data.result.forEach(d => {
          d.T = moment(d.T).add(7, 'hour').format('YYYY-MM-DD HH:mm:ss')
          d.CurrentTime = moment(d.T).format('YYYY-MM-DD')
        })

        res.send(data.result.filter(d => moment().diff(moment(d.T), 'days') < 5))
      }
    })
  })

// Get detail daily of market by name
router.route('/markets/:marketName/daily')
  .get((req, res) => {
    let marketName = req.params.marketName || ''

    bittrex.getcandles({marketName: marketName, tickInterval: 'day'}, data => {
      if (data) {
        data.result.forEach(d => {
          d.CurrentTime = moment(d.T).format('YYYY-MM-DD')
        })

        res.send(data.result.filter(d => moment().diff(moment(d.T), 'days') < 10))
      }
    })
  })

// Get all markets is following
router.route('/markets/following')
  .get((req, res) => {
    db.collection('market_following').find().sort({marketName: 1}).toArray((err, data) => {
      res.send(data.map(market => market.marketName))
    })
  })

/*
 Market following
  */
router.route('/markets/:marketName/following')

  // Check a market is following or not
  .get((req, res) => {
    let marketName = req.params.marketName || ''

    if (marketName !== '') {
      db.collection('market_following').findOne({marketName: marketName}).then(data => {
        res.send(!!data)
      })
    }
  })

  // Add a market to following list
  .post((req, res) => {
    let marketName = req.params.marketName || ''

    if (marketName !== '') {
      db.collection('market_following').insert({marketName: marketName}).then(() => res.send('200'))
    }
  })

  // Remove a market from following list
  .delete((req, res) => {
    let marketName = req.params.marketName || ''

    if (marketName !== '') {
      db.collection('market_following').deleteOne({marketName: marketName}).then(() => res.send('200'))
    }
  })
// End

function insertCandleData () {
  // Check if time now is the ... minute of an hour
  if (moment().format('mm') === '03') {
    console.log('Fetching data ...')

    bittrexClient.getMarketSummaries().then(data => {
      let btcMarkets = (data && data.result.filter(d => /^BTC-.+$/.test(d.MarketName) && !/BTC-(TIME|TKN)/.test(d.MarketName))) || []

      btcMarkets.forEach((item, idx) => {
        setTimeout(() => {
          bittrex.getcandles({marketName: item.MarketName, tickInterval: 'hour'}, data => {
            data && insertCandleHourTbl(data, item)
          })
        }, idx * 850)
      })
    })
  }
}

function insertCandleHourTbl (data, item) {
  data.result.forEach(d => {
    d.T = moment(d.T).add(7, 'hour').format('YYYY-MM-DD HH:mm:ss')
    d.CurrentTime = moment(d.T).format('YYYY-MM-DD')
  })

  let filterLatestDays = data.result.filter(d => moment().diff(moment(d.CurrentTime), 'days') < 1)

  db.collection('candle_hour').update(
    {marketName: item.MarketName},
    {
      $set: {
        baseVolume: item.BaseVolume,
        result: filterLatestDays
      }
    },
    {upsert: true})
}
