/*  URL -- https://openweathermap.org/api/one-call-api  ;  key = f072a53293f6d06b6e792cf7f399a3ea  */
/* example code -- http://api.openweathermap.org/data/2.5/weather?q=Charlotte&units=imperial&appid=f072a53293f6d06b6e792cf7f399a3ea */

/*const url2 = 'http://api.openweathermap.org/data/2.5/weather?q=Charlotte&units=imperial&appid=f072a53293f6d06b6e792cf7f399a3ea';  // API Key activated after 2 hours 
const url2a = 'http://api.openweathermap.org/data/2.5/weather?lat=-80.8432&lon=35.2271&units=imperial&appid=f072a53293f6d06b6e792cf7f399a3ea';  // lat/long 
const url2b = 'http://api.openweathermap.org/data/2.5/forecast?q=Charlotte&units=imperial&appid=f072a53293f6d06b6e792cf7f399a3ea';  */

/* url2 is current weather;  request options avail found at https://www.npmjs.com/package/request */
/*  url2a gives strange results for temperature -- call by lat/long may not work correctly */
/* url2b is forecast weather, returns an array of about 40 entries in 3 hour increments */

const request = require('request');     // note: request is deprecated;  may need to replace this 

const forecast = (long, lat, callback) => { 
    const url = 'http://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + long + '&units=imperial&appid=f072a53293f6d06b6e792cf7f399a3ea';
    //const url = 'http://api.openweathermap.org/data/2.5/weather?q='+ city + '&units=imperial&appid=f072a53293f6d06b6e792cf7f399a3ea';
  
    // request({ url: url, json: true }, (error, response) => {
    request({ url, json: true }, (error, {body}) => {    // shorthand syntax from above line;  destructuring of response object to var body which 
                                                         //       is an object representing response.body  
        if (error) {
            callback('Server error -- Unable to connect to location services');  
        }
        else if (body.cod == 400) {
            callback('Unable to find location.  Try a different search');
        }
        else {
            callback(null, /*'Weather summary: '+*/ Math.round(body.main.temp)   // main data is in response.body
                + ' degrees.  ' + body.weather[0].main + '.  Wind speed is ' + body.wind.speed + ' mph'
                /*+ '.  Temp high = ' +  Math.round(body.main.temp_max) + '. Temp low = ' +  Math.round(body.main.temp_min)*/);

             /*   date: response.body.list[0].dt_txt, 
                temp: Math.round(response.body.list[0].main.temp) + ' degrees.  ', 
                conditions: response.body.list[0].weather[0].main, 
                windSpeed: response.body.list[0].wind.speed*/
            
        }
    })
} 

module.exports = forecast; 