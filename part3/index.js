require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

// ######################
// middleware
// ######################

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.message.indexOf('duplicate key error') !== -1) {
    return response.status(409).json({ error: 'duplicate key' });
  }

  next(error);
};

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

/* prettier-ignore */ {
  morgan.token('body', (req) => JSON.stringify(req.body));
  morgan.format('detail', ':method :url :status :req[content-length] - :response-time ms :body'); 
}

// ######################
// application
// ######################
const app = express();

/* setup middleware */
app.use(express.static('build')); // frontend folder
app.use(cors()); // cors-handling (cross-origin resource sharing)
app.use(express.json()); // body-parser
app.use(morgan('detail')); // logger

/* setup routes */
app.get('/info', (_, response, next) => {
  Person.find({})
    .then((persons) => {
      const content =
        `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${new Date()}</p>`;

      response.send(content);
    })
    .catch((error) => next(error));
});

app.get('/api/persons', (_, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

// ######################
// server
// ######################

/* configuration */
const PORT = process.env.PORT;

/* setup server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
