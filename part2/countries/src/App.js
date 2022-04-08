import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState()

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
      .then(response => {
        setWeather(response.data);
      })
  }, []);

  if (!weather) {
    return <p>Loading ...</p>
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>temperature {(weather.main.temp - 273.15 /*K*/).toFixed(2)} Celcius</div>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

const CountryDetails = ({ country }) => {
  const languages = Object.values(country.languages);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h2>languages:</h2>
      <ul>
        {languages.map((language, i) => <li key={i}>{language}</li>)}
      </ul>
      <img width="150" height="150" src={country.flags.svg} alt={country.flag} />
      <Weather capital={country.capital} />
    </div>
  )
}

const Country = ({ country, onClick }) => {
  return (
    <div>
      {country.name.common}
      <button onClick={(event) => onClick(event, country)}>show</button>
    </div>
  )
}

const CountryList = ({ countries, onClick }) => {
  return (
    <div>
      {countries.map(country => <Country key={country.name.common} country={country} onClick={onClick} />)}
    </div>
  )
}

const Countries = ({ countries, onClick }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return <CountryList countries={countries} onClick={onClick} />
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response => {
        setCountries(response.data.sort((a, b) => (a.name.common > b.name.common) ? 1 : -1));
      })
  }, [])

  const handleSearchTextChanged = (event) => {
    setSearchText(event.target.value)
  }

  const handleShowDetails = (event, element) => {
    setSearchText(element.name.common);
  }

  const filterCountries = searchText.length > 0
    ? countries.filter(country => country.name.common.toLowerCase().includes(searchText.toLowerCase()))
    : countries;

  return (
    <div>
      <div>find countries <input value={searchText} onChange={handleSearchTextChanged} /></div>
      <Countries countries={filterCountries} onClick={handleShowDetails} />
    </div>
  );
}

export default App;
