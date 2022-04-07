// Renders the name of the course
const Header = ({ course }) => {
  return <h1>{course}</h1>
};

// Renders a single part with exercises
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

// Renders the parts and their number of exercises
const Content = ({ parts }) => {
  const [part1, part2, part3, ...rest] = parts;

  return (
    <div>
      <Part part={part1} />
      <Part part={part2} />
      <Part part={part3} />
    </div>
  );
};

// Renders the total number of exercises
const Total = ({ parts }) => {
  const [part1, part2, part3, ...rest] = parts;

  return (
    <p>Number of exercises {part1.exercises + part2.exercises + part3.exercises}</p>
  );
};

// Renders a course
const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App;
