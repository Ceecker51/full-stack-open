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
];

interface ExerciseValues {
  daily_exercises: Array<number>,
  target: number
}

export const parseExercises = (exerciesRaw: any[], targetRaw: any): ExerciseValues => {
  if (!targetRaw || exerciesRaw.length === 0) throw new Error("Not enough arguments");

  if (isNaN(Number(targetRaw)) || exerciesRaw.some(n => isNaN(Number(n)))) {
    throw new Error("malformatted parameters");
  }

  const daily_exercises = exerciesRaw.map(n => Number(n));
  const target = Number(targetRaw);

  return {
    daily_exercises,
    target
  };
};

export const calculateExercises = (exerciseHours: Array<number>, target: number): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.reduce((sum, current) => sum + (current > 0 ? 1 : 0), 0);
  const totalHours = exerciseHours.reduce((sum, current) => sum + current, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  const rating = average >= target - 0.3 ? 2 : average >= target ? 3 : 1;

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription: ratings[rating - 1],
    target,
    average
  };
};

// try {
//   const { dailyExercises, target } = parseExercises(process.argv);
//   const result = calculateExercises(dailyExercises, target);
//   console.log(result);
// } catch (error: unknown) {
//   let errorMessage = 'An error occured.';
//   if (error instanceof Error) {
//     errorMessage += ` Error: ` + error.message;
//   }
//   console.log(errorMessage);
// }
