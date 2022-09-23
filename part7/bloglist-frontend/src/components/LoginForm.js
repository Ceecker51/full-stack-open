import { useDispatch } from 'react-redux';
import { useField } from '../hooks';

import { login } from '../reducers/authReducer';

import { Button, Form } from 'react-bootstrap';

const LoginForm = () => {
  const dispatch = useDispatch();

  const { reset: resetUsername, ...username } = useField('text');
  const { reset: resetPassword, ...password } = useField('password');

  const handleLogin = (event) => {
    event.preventDefault();

    dispatch(login(username.value, password.value));

    resetUsername();
    resetPassword();
  };

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control {...username} />
        <Form.Label>password:</Form.Label>
        <Form.Control {...password} />
      </Form.Group>
      <Button style={{ marginTop: 10 }} type="submit" variant="primary">
        login
      </Button>
    </Form>
  );
};

export default LoginForm;
