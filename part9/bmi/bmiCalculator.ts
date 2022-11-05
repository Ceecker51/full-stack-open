interface BMIValues {
  height: number,
  weight: number
}

const parseArguments = (args: Array<string>): BMIValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (isNaN(Number(args[2])) || isNaN(Number(args[3]))) {
    throw new Error('Provided values were not numbers!');
  }

  return {
    height: Number(args[2]),
    weight: Number(args[3])
  }
}

const calculateBmi = (height: number, weight: number): string => {
  let bmi = weight / ((height / 100) ** 2)

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 25) {
    return "Overweight";
  } else {
    return "Normal"
  }
}

try {
  const { height, weight } = parseArguments(process.argv);
  const result = calculateBmi(height, weight)
  console.log(result)
} catch(error: unknown) {
  let errorMessage = 'An error occured.'
  if (error instanceof Error) {
    errorMessage += ` Error: ` + error.message;
  }
  console.log(errorMessage)
}
