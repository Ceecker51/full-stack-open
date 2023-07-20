import { StyleSheet, Pressable } from "react-native";
import { Link } from "react-router-native";

import Text from "./Text";

import theme from "../theme";

const styles = StyleSheet.create({
  item: {
    flexGrow: 1,
    alignItems: "center",

    backgroundColor: theme.colors.barBackground,

    paddingTop: 20,
    paddingBottom: 20,
  }
});

const AppBarTab = ({ text, url }) => {
  return (
    <Link style={styles.item} to={url}>
      <Text
        fontWeight="bold"
        color="white"
        fontSize="subheading"
      >
        {text}
      </Text>
    </Link>
  );
};

export default AppBarTab;
