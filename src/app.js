const update = document.querySelector(".update img");
const form = document.querySelector("form");
const information = document.querySelector(".information");
const sunMoonIcons = document.querySelector(".sunMoonIcons");
//json server
const fetchJsonData = async () => {
  try {
    const response = await fetch("./src/descriptions.json");
    if (!response.ok) {
      throw new Error(`error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Error fetching JSON: ", err);
  }
};
// last update time func:
const updateLastUpdateTime = (lastUpdateTime) => {
  const updateSpan = document.querySelector(".update span");
  updateSpan.innerHTML = `Last updated: ${lastUpdateTime.toLocaleString()}`;
};

// 1
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.cityInput.value.trim();
  form.reset();

  dataGrabber(name).then((data) => console.log(data));
});

// 2
const dataGrabber = async (name) => {
  const jsonData = await fetchJsonData();
  const weatherInformation = await getWeather(name)
    .then((data) => updateUi(data, jsonData))
    .catch((err) => console.log(err));
};
// 3
const updateUi = (data, jsonData) => {
  const name = data.name;
  const temp = data.temperature;
  const speed = data.windSpeed;
  const moist = data.humidity;
  const summary = data.code;
  const dayNight = data.dayNight;

  const { image: imgLink, description: descriptions } =
    jsonData[summary][dayNight];

  information.classList.remove("notDisplay");
  sunMoonIcons.classList.remove("notDisplay");

  // Update the background color based on the dayNight value
  const dayColor = "#4e6aa0";
  const nightColor = "#282c34";
  const backgroundColor = dayNight === "day" ? dayColor : nightColor;
  document.body.style.backgroundColor = backgroundColor;

  // Update the texts color based on the dayNight value
  const dayText = "#282c34";
  const nightText = "#4e6aa0";
  const textColor = dayNight === "day" ? dayText : nightText;
  document.body.style.color = textColor;

  // Apply the text color + background color transition animation
  document.body.style.transition = "background-color 2s , color 2s";

  // toggle the sun and moon icons animations
  const sun = document.querySelector(".sun");
  const moon = document.querySelector(".moon");

  if (dayNight === "day") {
    sun.style.animation = "hi 3s forwards";
    moon.style.animation = "bye 3s forwards";
  } else {
    sun.style.animation = "bye 3s forwards";
    moon.style.animation = "hi 3s forwards";
  }

  // moist and wind speed icons mode(for day and night)
  const moistIcon = document.querySelector(".icons img:first-child");
  const windSpeedIcon = document.querySelector(".icons img:last-child");

  if (dayNight === "night") {
    moistIcon.src = "./src/imgs/humidity_light.png";
    windSpeedIcon.src = "./src/imgs/air_light.png";
  } else {
    moistIcon.src = "./src/imgs/humidity_blue.png";
    windSpeedIcon.src = "./src/imgs/air_blue.png";
  }

  const humidityIcon = moistIcon.src;
  const airIcon = windSpeedIcon.src;

  information.innerHTML = `
  <div class="information">
        <h3 class="cityName">${name}</h3>

        <div class="weather">
        <div>${descriptions}</div>
          <img
            src=${imgLink}
            class="condition-img"
            alt="wx condition img"
          />
          <div class="degree">${temp}&deg;C</div>
        </div>
      </div>

      <div class="details">
        <div class="icons">
          <img src=${humidityIcon} alt="moist icon" />
          <img src=${airIcon} alt="wind speed icon" />
        </div>
        <div class="detailsNumbers">
          <span class="moist">${moist}%</span>
          <span class="windSpeed">${speed} Kph</span>
        </div>
      </div>
    </div>`;

  // update last updated time:
  let lastUpdateTime = new Date();
  updateLastUpdateTime(lastUpdateTime);
};

// update button
update.addEventListener("click", () => {
  const cityNameElement = document.querySelector(".cityName");
  if (cityNameElement) {
    const cityName = cityNameElement.textContent;
    dataGrabber(cityName).then(console.log("updated"));
  } else {
    console.error("City name element not found");
  }
});
