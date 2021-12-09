const api = {
	key: "a8f9edaf58689dc46c69e17451bc4d69",
	base: "https://api.openweathermap.org/data/2.5/"
  }
  
  const searchbox = document.querySelector('.search-box');
  searchbox.addEventListener('keypress', setQuery);
  
  function setQuery(evt) {
	if (evt.keyCode == 13) {
	  saveStorage(searchbox.value);
	  getResults(searchbox.value);
	}
  }
  
  function getResults (query) {
	fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
	  .then(weather => {
		return weather.json();
	  }).then(displayResults);
  }
  
  function displayStorage () {
	let storage = JSON.parse(localStorage.getItem('city'));
	if (!storage) {
		storage = [];
	}
	for(let i = 0; i < storage.length; i++) {
		let button = document.createElement('button');
		button.innerHTML = storage[i];
		let history = document.querySelector('.history');
		history.appendChild(button);
	} 
  }
  displayStorage();
  function saveStorage (city) {
	let storage = JSON.parse(localStorage.getItem('city'));
	if (!storage) {
		storage = [];
	}
	storage.push(city);
	localStorage.setItem('city', JSON.stringify(storage));
	let button = document.createElement('button');
	button.innerHTML = city;
	let history = document.querySelector('.history');
	history.appendChild(button);
  }

  function displayResults (weather) {
	let city = document.querySelector('.location .city');
	console.log(weather);
	city.innerText = `${weather.name}, ${weather.sys.country}`;
  
	let now = new Date();
	let date = document.querySelector('.date');
	date.innerText = dateBuilder(now);
  
	let temp = document.querySelector(".temp");
	temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
  
	// let weather_el = document.querySelector('.current .weather');
	// weather_el.innerText = weather.weather[0].main;
  
	// let hilow = document.querySelector('.temp');
	// hilow.innerText = `${Math.round(weather.main.temp_max)}°c`;
	let icon = document.querySelector('.icon');
	icon.setAttribute('src', `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);

	let description = document.querySelector('.description');
	description.innerHTML = `${weather.weather[0].description}`; 

	let humidity = document.querySelector('#humidity');
	humidity.innerHTML = `Humidity: ${weather.main.humidity}%`;

	let windspeed = document.querySelector('#wind-speed');
	windspeed.innerHTML = `Wind Speed: ${weather.wind.speed}km/h`;

	let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${weather.coord.lat}&lon=${weather.coord.lon}&units=metric&appid=${api.key}`;
	
	fetch(url)
	  .then(weather => {
		return weather.json();
	  }).then(data => {
		let uvi = document.querySelector('#uvindex');
		uvi.innerHTML = `UV Index: ${data.current.uvi}`;
		console.log(data);
		let forecast = document.querySelector('.forecast');
		forecast.innerHTML = ""
		for(let i=0; i < 5; i++) {
			let day = document.createElement('div');
			day.classList.add('col-2');
			let date = document.createElement('div');
			date.innerHTML = `(${new Date(data.daily[i].dt*1000).toLocaleDateString()})`
			day.appendChild(date);
			let icon = document.createElement('img');
			icon.setAttribute('src', `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`);
			day.appendChild(icon);
			let temp = document.createElement('div');
			temp.innerHTML = `Temp: ${data.daily[i].temp.day}C`;
			day.appendChild(temp);
			let humidity = document.createElement('div');
			humidity.innerHTML = `Humidity: ${data.daily[i].humidity}%`;
			day.appendChild(humidity);
			let windspeed = document.createElement('div');
			windspeed.innerHTML = `Wind Speed: ${data.daily[i].wind_speed}km/h`;
			day.appendChild(windspeed);






			forecast.appendChild(day);
		}



	  }) ;
  }

  
  function dateBuilder (d) {
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
	let day = days[d.getDay()];
	let date = d.getDate();
	let month = months[d.getMonth()];
	let year = d.getFullYear();
  
	return `${day} ${date} ${month} ${year}`;
  }