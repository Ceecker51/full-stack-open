import express from "express";
import { parseArguments, calculateBmi } from './bmiCalculator'

const PORT = 3003;
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
})

// http://localhost:3002/bmi?height=180&weight=72
app.get("/bmi", (req, res) => {
  let height = req.query.height;
  let weight = req.query.weight;

  if (!height || !weight) {
    res.status(400);
    res.send({ error: 'missing parameters' });
    return;
  }

  try {
    const params = parseArguments([height, weight])
    const bmi = calculateBmi(params.height, params.weight)

    res.status(200)
    res.send({ weight: params.weight, height: params.height, bmi })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400);
      res.send({ error: error.message });
    }
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
