const update = document.querySelector(".update img");
const form = document.querySelector("form");
const information = document.querySelector(".information");

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

  information.classList.remove('notDisplay')

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
          <img src="./src/imgs/humidity_blue.png" alt="moist icon" />
          <img src="./src/imgs/air_blue.png" alt="wind speed icon" />
        </div>
        <div class="detailsNumbers">
          <span class="moist">${moist}%</span>
          <span class="windSpeed">${speed} Kph</span>
        </div>
      </div>
    </div>`;
};
