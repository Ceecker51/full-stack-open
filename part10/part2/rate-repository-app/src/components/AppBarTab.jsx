import { StyleSheet, Pressable } from "react-native";

import Text from "./Text";
import theme from "../theme";

const styles = StyleSheet.create({
  flexItem: {
    flexGrow: 1,
  },
  text: {
    backgroundColor: theme.appBar.backgroundColor,
    color: theme.appBar.color,

    fontSize: theme.appBar.fontSize,
    fontWeight: theme.appBar.fontWeight,

    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
  },
});

const AppBarTab = () => {
  const onPress = () => {
    console.log("Pressed");
  };

  return (
    <Pressable style={styles.flexItem} onPress={onPress}>
      <Text style={styles.text}>Repositories</Text>
    </Pressable>
  );
};

export default AppBarTab;
