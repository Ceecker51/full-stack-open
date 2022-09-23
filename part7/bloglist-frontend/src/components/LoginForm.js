import { useDispatch } from 'react-redux';
import { useField } from '../hooks';

import { login } from '../reducers/authReducer';

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
    <form onSubmit={handleLogin}>
      <div>
        username
        <input {...username} />
      </div>
      <div>
        password
        <input {...password} />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
