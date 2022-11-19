import { assertNever, CoursePart } from '../types';

interface PartProps {
  part: CoursePart;
}

const Part = ({ part }: PartProps) => {
  switch (part.type) {
    case 'normal':
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <br />
          {part.description}
        </p>
      );
    case 'groupProject':
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case 'submission':
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <br />
          {part.description}
          <br />
          submit to {part.exerciseSubmissionLink}
        </p>
      );
    case 'special':
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <br />
          {part.description}
          <br />
          required skils: {part.requirements.join(', ')}
        </p>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
