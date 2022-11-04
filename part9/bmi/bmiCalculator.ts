const calculateBmi = (height: number, weight: number): string => {
  let bmi = weight / height ^ 2

  if (bmi < 18.5) {
    return "Underweight (healthy, weight)";
  } else if (bmi >= 25) {
    return "Overweight (healthy, weight)";
  } else {
    return "Normal (healthy, weight)"
  }
}

console.log(calculateBmi(180, 74))
