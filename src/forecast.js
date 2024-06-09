const getWeather = async (cityName) => {
  try {
    // get location lat+lon
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
    );
    const geoData = await geoRes.json();
    const lon = geoData.results[0].longitude;
    const lat = geoData.results[0].latitude;

    //     get weather info
    const weatherInformation = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,weather_code,is_day,wind_speed_10m`
    );
    const weatherData = await weatherInformation.json();
    console.log(weatherData);

    const currentHourIndex = new Date().getHours();
    console.log(currentHourIndex);

    const currentTemperature =
      weatherData.hourly.temperature_2m[currentHourIndex];
    const currentWindSpeed =
      weatherData.hourly.wind_speed_10m[currentHourIndex];
    const currentHumidity =
      weatherData.hourly.relative_humidity_2m[currentHourIndex];
    const currentWeatherCode =
      weatherData.hourly.weather_code[currentHourIndex];

    //     day or night?
    const dayCode = weatherData.hourly.is_day[currentHourIndex];
    const dayNight = dayCode == 1 ? "day" : "night";

    //     get original name
    const reverseGeoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const reverseGeoData = await reverseGeoRes.json();
    const locationName =
      reverseGeoData.address.city ||
      reverseGeoData.address.county ||
      reverseGeoData.display_name[0] ||
      reverseGeoData.address.municipality;

    return {
      dayNight: dayNight,
      code: currentWeatherCode,
      name: locationName,
      temperature: currentTemperature,
      windSpeed: currentWindSpeed,
      humidity: currentHumidity,
    };
  } catch (err) {
       console.log(err)
       throw err;
  }
};
