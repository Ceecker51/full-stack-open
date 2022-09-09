const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => (
  <form onSubmit={handleLogin}>
    <div>
      username
      <input
        id="username"
        name="Username"
        type="text"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
      <input
        id="password"
        name="Password"
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button id="login-button" type="submit">
      login
    </button>
  </form>
);

export default LoginForm;
