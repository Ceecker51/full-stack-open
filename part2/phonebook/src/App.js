import { useState, useEffect } from "react";
import axios from "axios"

const Filter = ({ searchField, changeSearchField }) => {
  return (
    <div>filter shown with<input value={searchField} onChange={changeSearchField} /></div>
  )
}

const PersonForm = ({ onSubmit, newName, changeName, newNumber, changeNumber }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={changeName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={changeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons }) => {
  return persons.map(person =>
    <div key={person.name}>{person.name} {person.number}</div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchField, setSearchField] = useState('');

  useEffect(() => {
    const url = 'http://localhost:3001/persons';
    axios
      .get(url)
      .then((response) => setPersons(response.data))
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObj = {
      name: newName,
      number: newNumber
    };

    axios
      .post('http://localhost:3001/persons', personObj)
      .then(response => {
        setPersons(persons.concat(response.data));

        setNewName('');
        setNewNumber('');
      });
  }

  const handleNewName = (event) => {
    setNewName(event.target.value);
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearchField = (event) => {
    setSearchField(event.target.value);
  }

  const filteredPersons = searchField.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(searchField.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchField={searchField} changeSearchField={handleSearchField} />
      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson}
        newName={newName} changeName={handleNewName}
        newNumber={newNumber} changeNumber={handleNewNumber} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App;
