import React from "react";

// Renders the name of the course
const Header = ({ course }) => {
  return <h2>{course.name}</h2>
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
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  );
};

// Renders the total number of exercises
const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <p><b>total of {total} exercises</b></p>
  );
};

// Renders a course
const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default Course