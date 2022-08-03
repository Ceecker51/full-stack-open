require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

// ######################
// data
// ######################

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// ######################
// middleware
// ######################

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
};

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: "unkown endpoint" });
};

/* prettier-ignore */ {
morgan.token("body", (req, _) => JSON.stringify(req.body));
morgan.format("detail", ":method :url :status :req[content-length] - :response-time ms :body"); 
}

// ######################
// application
// ######################
const app = express();

/* setup middleware */
app.use(express.static("build")); // frontend folder
app.use(cors()); // cors-handling (cross-origin resource sharing)
app.use(express.json()); // body-parser
app.use(morgan("detail")); // logger

/* setup routes */
app.get("/info", (_, response) => {
  const content =
    `<p>Phonebook has info for ${persons.length} people</p>` +
    `<p>${new Date()}</p>`;

  response.send(content);
});

app.get("/api/persons", (_, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

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

app.get("/api/persons/:id", (request, response, next) => {
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

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
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

// ##########################
// custom methods
// ##########################

const generateId = () => {
  return Math.round(Math.random() * 10000);
};
