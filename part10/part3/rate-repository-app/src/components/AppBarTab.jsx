import { StyleSheet, Pressable } from "react-native";
import { Link } from "react-router-native";

import Text from "./Text";

const styles = StyleSheet.create({
  item: {
    flexGrow: 1,

    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 20,
  },
});

const AppBarTab = ({ text, url, onPress }) => {
  if (url) {
    return (
      <Link style={styles.item} to={url}>
        <Text fontWeight="bold" color="white" fontSize="subheading">
          {text}
        </Text>
      </Link>
    );
  }

  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Text fontWeight="bold" color="white" fontSize="subheading">
        {text}
      </Text>
    </Pressable>
  );
};

export default AppBarTab;
