const Notification = ({ message }) => {
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

  return <div style={messageStyle}>{message.text}</div>;
};

export default Notification;
