import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';

const useBootstrap = true;

const Notification = () => {
  const message = useSelector((state) => state.notification);

  if (!message) {
    return null;
  }

  const getColor = (type) => {
    if (type === 'success') return 'green';
    else if (type === 'error') return 'red';

    return 'black';
  };

  const getVariant = (type) => {
    if (type === 'success') return 'success';
    else if (type === 'error') return 'danger';

    return 'primary';
  };

  const messageStyle = {
    color: getColor(message.type),
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={{ marginTop: 10 }}>
      {useBootstrap ? (
        <Alert variant={getVariant(message.type)}>{message.text}</Alert>
      ) : (
        <div className="notification" style={messageStyle}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Notification;
