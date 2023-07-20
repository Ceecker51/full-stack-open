import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'gray',
    padding: 10,
  },
  textInputError: {
    height: 40, 
    borderColor: '#d73a4a', 
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
  }
});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = error ? [styles.textInputError, style] : [styles.textInput, style] ;

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;