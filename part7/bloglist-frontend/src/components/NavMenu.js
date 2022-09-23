import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { logout } from '../reducers/authReducer';

const NavMenu = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  const padding = {
    paddingRight: 5,
  };

  const background = {
    padding: 5,
    backgroundColor: '#d3d3d3',
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <p style={background}>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {authUser.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
    </div>
  );
};

export default NavMenu;
