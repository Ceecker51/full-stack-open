const express = require("express");

const PORT = 3001;

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

const app = express();
app.use(express.json());

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
    response.status(404).end();
    return;
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const generateId = () => {
  return Math.round(Math.random() * 10000);
};
