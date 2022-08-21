/**
 * A simple mongoose interaction script
 *
 * Action: Get all persons
 * Commands:
 *  - node mongo.js yourpassword
 * Result:
 *  phonebook:
 *  Anna 040-1234556
 *  Arto Vihavainen 045-1232456
 *  Ada Lovelace 040-1231236
 *
 * Action: Create new persons
 * Commands:
 *  - node mongo.js yourpassword Anna 040-1234556
 *  - node mongo.js yourpassword "Arto Vihavainen" 045-1232456
 * Result: added Anna number 040-1234556 to phonebook
 */

const mongoose = require('mongoose');

// ############################
// parse application arguments
// ############################

if (process.argv.length < 3 || process.argv.length > 5) {
  console.log('Usage:');
  console.log('\tnode mongo.js <password>');
  console.log('\tnode mongo.js <password> <name> <number>');
  process.exit(1);
}

const canCreatePerson = process.argv.length > 3;
const password = process.argv[2];

/* Connet to database and setup schema */
const dbname = 'phonebook';
const url = `mongodb+srv://fullstack:${password}@cluster0.eksv7.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// ####################################
// Execute Queries
// ####################################

if (canCreatePerson) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to ${dbname}`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log(`${dbname}:`);

    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
}
