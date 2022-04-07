import { useState, useEffect } from 'react'
import axios from 'axios'

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
    </div>
  )
}

const CountryList = ({ countries }) => {
  return (
    <div>
      {countries.map(country => <div key={country.name.common}>{country.name.common}</div>)}
    </div>
  )
}

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return <CountryList countries={countries} />
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

  const filterCountries = searchText.length > 0
    ? countries.filter(country => country.name.common.toLowerCase().includes(searchText.toLowerCase()))
    : countries;

  return (
    <div>
      <div>find countries <input value={searchText} onChange={handleSearchTextChanged} /></div>
      <Countries countries={filterCountries} />
    </div>
  );
}

export default App;
