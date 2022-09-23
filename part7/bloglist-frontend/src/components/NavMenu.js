import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Nav, Navbar } from 'react-bootstrap';

import { logout } from '../reducers/authReducer';

const NavMenu = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link to="/users">users</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            {authUser.name} logged in{' '}
            <Button variant="secondary" onClick={handleLogout} size="sm">
              logout
            </Button>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavMenu;
