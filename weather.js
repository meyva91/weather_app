const https = require("https");
const api = require("./api.json");

function getLocation(searchQuery) {
  const apiKey = api.apikey;
  const locationResourceURL = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${searchQuery}`;

  return new Promise((resolve, reject) => {
    const request = https.get(locationResourceURL, (response) => {
      let responseBody = "";
      response.on("data", (data) => {
        responseBody += data.toString();
      });
      response.on("end", () => {
        //taking first result coming from server, may be improved.
        let reponseParse = JSON.parse(responseBody)[0];
        let locationData = {
          key: reponseParse.Key,
          city: reponseParse.EnglishName,
          country: reponseParse.Country.EnglishName,
        };
        resolve(locationData);
      });
      response.on("error", () => {
        reject(new Error("Something went wrong!"));
      });
    });
  });
}

function getForecast(locationKey) {
  const apiKey = api.apikey;
  const forecastResourceURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&metric=true`;

  return new Promise((resolve, reject) => {
    const request = https.get(forecastResourceURL, (response) => {
      let responseBody = "";
      response.on("data", (data) => {
        responseBody += data.toString();
      });
      response.on("end", () => {
        //taking first result coming from server, may be improved.
        let reponseParse = JSON.parse(responseBody);
        let forcastData = {
          min: reponseParse.DailyForecasts[0].Temperature.Minimum.Value,
          max: reponseParse.DailyForecasts[0].Temperature.Maximum.Value,
          source: reponseParse.DailyForecasts[0].Sources[0],
        };
        resolve(forcastData);
      });
      response.on("error", () => {
        reject(new Error("Something went wrong!"));
      });
    });
  });
}

function getWeatherData(searchQuery) {
  return new Promise((resolve, reject) => {
    getLocation(searchQuery).then((locationData) => {
      getForecast(locationData.key).then((forecastData) => {
        resolve(
          `Today in ${locationData.city}, ${locationData.country}, temperature is min: ${forecastData.min} C, max: ${forecastData.max} C.`
        );
      });
    });
  });
}

module.exports.get = getWeatherData;
