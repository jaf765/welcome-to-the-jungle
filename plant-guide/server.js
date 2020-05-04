const USER_API_KEY = 'N1NhQ2lHUFA3RUx3eHA4c1RhdTQ5QT09'
const ORIGIN = 'jaf765.itp.io'
var TOKEN

var express = require('express')
var app = express()
var https = require('https')

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


const checkOrUpdateToken = function(callback) {
  var nowTimeInSeconds = Date.now() / 1000

  if (TOKEN && TOKEN.expiration > nowTimeInSeconds) {
    // This means we have an active token, and don't need to update it.
    console.log('TOKEN VERIFICATION: We already have a valid token!')
    callback()
    return
  } else {
    console.log('TOKEN VERIFICATION: Requesting a new token...')

    https.request({
      host: 'trefle.io',
      path: '/api/auth/claim?token=' + USER_API_KEY + '&origin=' + ORIGIN,
      method: 'POST'
    }, function(response) {
        // This string will contain everything back from the server but it will come in chunks
        var str = '';
        // Got a chunk
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function () {
          // This is where our HTTP request for a Trefke token is complete. str will contain all the results.
          // We need to convert str into an object, and that is our token!
          var responseObject = JSON.parse(str)
          TOKEN = responseObject

          // Now that we've updated the TOKEN, we can invoke the callback,
          // which means we return to actually executing our code in app.get('/advancedplants') or whatever.
          callback()
          console.log('TOKEN VERIFICATION: Done acquiring new token!')
        });
    }).end()
  }
}

app.get('/', function (req, res) {
  res.render('index.ejs', {});
})


//ADVANCED PLANT LIST (fiddle leaf fig, adiantum, peacock plant)
app.get('/advancedplants', function(req, res) {
  checkOrUpdateToken(function() {
    var familyId = 1
    https.request({
      host: 'trefle.io',
      path: encodeURI('/api/plants/' + '?token=' + TOKEN.token + '&q=fiddleleaf fig'),
      method: 'GET'

    }, function(response) {
        var str = '';
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function ()
         {
          var plantsData = JSON.parse(str)
          // Here you have the URL for the plant
          //plantsData.link
//console.log(plantsData[0] + " " + TOKEN.token);
          https.request({
            host: 'trefle.io',
            path: encodeURI(plantsData[0].link + '?token=' + TOKEN.token),
            method: 'GET'

          }, function(response) {
              var str = '';
              response.on('data', function (chunk) { str += chunk; });
              response.on('end', function ()
               {


                res.send(str)
              });
          }).end()

  //        res.send(plantsData)
        });
    }).end()
  })
})


//INTERMEDIATE PLANT LIST (philodendron, croton pkant, zebra plant)
app.get('/intermediateplants', function(req, res) {
  checkOrUpdateToken(function() {
    var familyId = 1
    https.request({
      host: 'trefle.io',
      path: encodeURI('/api/plants/' + '?token=' + TOKEN.token + '&q=aphelandra squarrosa'),
      method: 'GET'

    }, function(response) {
        var str = '';
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function ()
         {
          var plantsData = JSON.parse(str)
          // Here you have the URL for the plant
          //plantsData.link
//console.log(plantsData[0] + " " + TOKEN.token);
          https.request({
            host: 'trefle.io',
            path: encodeURI(plantsData[0].link + '?token=' + TOKEN.token),
            method: 'GET'

          }, function(response) {
              var str = '';
              response.on('data', function (chunk) { str += chunk; });
              response.on('end', function ()
               {


                res.send(str)
              });
          }).end()
  //        res.send(plantsData)
        });
    }).end()
  })
})


//BEGINNER PLANTLIST (golden pothos, cheese plant, spider plant)
app.get('/beginnerplants', function(req, res) {
  checkOrUpdateToken(function() {
    var familyId = 1
    https.request({
      host: 'trefle.io',
      path: encodeURI('/api/plants/' + '?token=' + TOKEN.token + '&q=Epipremnum aureum'),
      method: 'GET'

    }, function(response) {
        var str = '';
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function ()
         {
          var pothosData = JSON.parse(str)

          https.request({
            host: 'trefle.io',
            path: encodeURI(pothosData[0].link + '?token=' + TOKEN.token),
            method: 'GET'

          }, function(response) {
              var str = '';
              response.on('data', function (chunk) { str += chunk; });
              response.on('end', function ()
               {


                res.send(str)
              });
          }).end()
  //        res.send(plantsData)
        });
    }).end()
  })
})
