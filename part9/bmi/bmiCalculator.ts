export interface BMIValues {
  height: number,
  weight: number
}

export const parseArguments = (args: Array<string>): BMIValues => {
  if (args.length < 2) throw new Error('Not enough arguments');
  if (args.length > 2) throw new Error('Too many arguments');

  if (isNaN(Number(args[0])) || isNaN(Number(args[1]))) {
    throw new Error('malformatted parameters');
  }

  return {
    height: Number(args[0]),
    weight: Number(args[1])
  };
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 25) {
    return "Overweight";
  } else {
    return "Normal";
  }
};

// try {
//   const { height, weight } = parseArguments(process.argv);
//   const result = calculateBmi(height, weight)
//   console.log(result)
// } catch(error: unknown) {
//   let errorMessage = 'An error occured.'
//   if (error instanceof Error) {
//     errorMessage += ` Error: ` + error.message;
//   }
//   console.log(errorMessage)
// }
