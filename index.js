const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')

const darkskyApiKey = '950c63fab35d31f7fea2bc4a165c5bf2'
const geoCodingApiKey = 'a6998a0b637e1e'

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let urlGeo = `https://us1.locationiq.com/v1/search.php?key=${geoCodingApiKey}&city=${city}&format=json`
  request(urlGeo, function (err, response, body) {
  	if (err) {
  	} else {
  		let geocode = JSON.parse(body);
  		if (geocode.error == "Unable to geocode") {
  			res.render('index', {
  				address: null,
  				timezone: null,
  				condition: null,
  				error: 'Error, please try again!'
  			});
  		} else {
  			let addressText = geocode[0].display_name;
  			let lat = geocode[0].lat;
  			let lon = geocode[0].lon;
  			let urlDark = `https://api.darksky.net/forecast/${darkskyApiKey}/${lat},${lon}`
  			request(urlDark, function (err, response, body) {
  				if (err) {
  					res.render('index', {
  						address: null,
  						timezone: null,
  						condition: null,
  						error: 'Error, please try again!'
  					});
  				} else {
  					let weather = JSON.parse(body);
  					let timezone = weather.timezone;
  					let condition = weather.hourly.summary;
  					res.render('index', {
  						address: addressText,
  						timezone: timezone,
  						condition: condition,
  						error: null
  					});
  				}
  			})
  		}
  	}
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})