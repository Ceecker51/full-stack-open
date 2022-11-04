interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const ratings = [
  "try harder",
  "not too bad could be better",
  "good enough"
]

const calculateExercises = (exerciseHours: Array<number>, target: number): Result => {
  let periodLength = exerciseHours.length;
  let trainingDays = exerciseHours.reduce((sum, current) => sum + (current > 0 ? 1 : 0), 0)
  let totalHours = exerciseHours.reduce((sum, current) => sum + current, 0)
  let average = totalHours / periodLength;
  let success = average >= target;

  let rating: number = average >= target - 0.3 ? 2 : average >= target ? 3 : 1;

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription: ratings[rating - 1],
    target,
    average
  }
}

const hoursOfExercises = [3, 0, 2, 4.5, 0, 3, 1]
const targetAmount = 2

const result = calculateExercises(hoursOfExercises, targetAmount)
console.log(result)
