import { StyleSheet, Pressable } from "react-native";

import Text from './Text';
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    padding: 10,
  },
  text: {
    textAlign: "center"
  },
});

const Button = ({ text, color, fontWeight, fontSize, onSubmit, style, ...props }) => {
  const containerStyle = [
    styles.container,
    style
  ];

  const textStyle = [
    styles.text,
  ];

  return (
    <Pressable onPress={onSubmit} style={containerStyle} {...props}>
      <Text
        color={color}
        fontWeight={fontWeight}
        fontSize={fontSize}
        style={textStyle}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default Button;
