import { useSelector } from 'react-redux';

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
    <div className="notification" style={messageStyle}>
      {message.text}
    </div>
  );
};

export default Notification;
