import { useState, useEffect } from "react";
import personService from './services/persons'

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

const Persons = ({ persons, onClick }) => {
  return persons.map(person =>
    <div key={person.name}>
      {person.name} {person.number}
      <button onClick={(event) => onClick(event, person)}>delete</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchField, setSearchField] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(initPersons => setPersons(initPersons))
      .catch(error => {
        alert(`Can not request persons from server.`)
      });
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

    personService
      .create(personObj)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));

        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        alert(`the person '${personObj.name}' can not be created on the server.`)
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

  const handleDeletePerson = (event, person) => {
    const message = `Delete ${person.name} ?`;

    if (window.confirm(message)) {
      personService
        .remove(person.id)
        .then(returnedPerson => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          alert(`the person '${person.name}' was already deleted from server`);
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
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
      <Persons persons={filteredPersons} onClick={handleDeletePerson} />
    </div>
  )
}

export default App;
