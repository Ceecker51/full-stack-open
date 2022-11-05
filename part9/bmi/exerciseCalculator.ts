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

interface ExerciseValues {
  hoursOfExercises: Array<number>,
  target: number
}

const parseExercises = (args: Array<string>): ExerciseValues => {
  if (args.length < 3) throw new Error("Not enough arguments");

  let target = 0;
  const resultList: Array<number> = [];
  for (let index = 2; index < args.length; index++) {
    const element = args[index];

    if (isNaN(Number(element))) {
      throw new Error('Provided values were not numbers!')
    }

    if (index === 2) {
      target = Number(element)
    } else {
      resultList.push(Number(element));
    }
  }

  return {
    hoursOfExercises: resultList,
    target
  }
}

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

try {
  const { hoursOfExercises, target } = parseExercises(process.argv);
  const result = calculateExercises(hoursOfExercises, target)
  console.log(result)
} catch (error: unknown) {
  let errorMessage = 'An error occured.'
  if (error instanceof Error) {
    errorMessage += ` Error: ` + error.message;
  }
  console.log(errorMessage)
}
