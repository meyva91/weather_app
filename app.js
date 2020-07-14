const weather = require("./weather.js");

weather.get("ankara").then((val) => {
  console.log(val);
});
