import express from "express";

import { parseArguments, calculateBmi } from './bmiCalculator';
import { parseExercises, calculateExercises } from './exerciseCalculator';

const PORT = 3003;
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

// http://localhost:3002/bmi?height=180&weight=72
app.get("/bmi", (req, res) => {
  const height = String(req.query.height);
  const weight = String(req.query.weight);

  if (!height || !weight) {
    return res.status(400).send({ error: 'missing parameters' });
  }

  try {
    const params = parseArguments([height, weight]);
    const bmi = calculateBmi(params.height, params.weight);

    return res.status(200).send({ weight: params.weight, height: params.height, bmi });
  } catch (error: unknown) {
    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage += error.message;
    }

    return res.status(400).send({ error: errorMessage });
  }
});

app.post('/exercises', (req, res) => {
  const daily_exercises = req.body.daily_exercises;
  const target = req.body.target;

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: 'missing parameters' });
  }

  try {
    const params = parseExercises(daily_exercises, target);
    const result = calculateExercises(params.daily_exercises, params.target);
    return res.status(200).send(result);
  } catch (error: unknown) {
    let errorMessage = '';

    if (error instanceof Error) {
      errorMessage += error.message;
    }
    return res.status(400).send({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
