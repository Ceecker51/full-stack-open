import Constants from "expo-constants";
import { View, StyleSheet, ScrollView } from "react-native";

import AppBarTab from "./AppBarTab";

import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
  scrollview: {
    backgroundColor: theme.colors.barBackground,
    display: "flex",
    flexDirection: "row", 
  }
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollview} horizontal>
        <AppBarTab text="Repositories" url="/" />
        <AppBarTab text="Sign in" url="/signin" />
      </ScrollView>
    </View>
  );
};

export default AppBar;
