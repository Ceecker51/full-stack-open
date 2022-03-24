// Renders the name of the course
const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  );
};

// Renders a single part with exercise
const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};

// Renders the parts and their number of exercises
const Content = (props) => {
  const [part1, part2, part3, ...rest] = props.parts;

  return (
    <div>
      <Part part={part1} />
      <Part part={part2} />
      <Part part={part3} />
    </div>
  );
};

// Renders the total number of exercises
const Total = (props) => {
  const [part1, part2, part3, ...rest] = props.parts;

  return (
    <p>Number of exercises {part1.exercises + part2.exercises + part3.exercises}</p>
  );
};

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
}

export default App;
