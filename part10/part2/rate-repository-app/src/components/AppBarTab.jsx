import { StyleSheet, Pressable } from "react-native";

import Text from "./Text";

import theme from "../theme";

const styles = StyleSheet.create({
  item: {
    flexGrow: 1,
  },
  tab: {
    backgroundColor: theme.colors.barBackground,

    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
  },
});

const AppBarTab = ({ text }) => {
  const onPressed = () => {
    console.log("Pressed");
  };

  return (
    <Pressable style={styles.item} onPress={onPressed}>
      <Text
        fontWeight="bold"
        color="white"
        fontSize="subheading"
        style={styles.tab}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default AppBarTab;
