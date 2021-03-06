const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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

/* prettier-ignore */ {
morgan.token("body", (req, _) => JSON.stringify(req.body));
morgan.format("detail", ":method :url :status :req[content-length] - :response-time ms :body"); 
}

// ######################
// application
// ######################
const app = express();

/* configuration */
const PORT = process.env.PORT || 3001;

/* setup middleware */
app.use(cors());                  // cors-handling (cross-origin resource sharing)
app.use(express.json());          // body-parser
app.use(morgan("detail"));        // logger
app.use(express.static('build')); // frontend folder

/* setup routes */
app.get("/info", (_, response) => {
  const content =
    `<p>Phonebook has info for ${persons.length} people</p>` +
    `<p>${new Date()}</p>`;

  response.send(content);
});

app.get("/api/persons", (_, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
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

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

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
