import { useState } from "react";

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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchField, setSearchField] = useState('');

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

    setPersons(persons.concat(personObj));

    setNewName('');
    setNewNumber('');
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
