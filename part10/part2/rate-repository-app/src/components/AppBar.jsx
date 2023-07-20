import Constants from "expo-constants";
import { View, StyleSheet } from "react-native";

import AppBarTab from "./AppBarTab";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
  },
});

const AppBar = () => {
  
  return (
    <View style={styles.container}>
      <AppBarTab text="Repositories" url="/" />
      <AppBarTab text="Sign in" url="/signin" />
    </View>
  );
};

export default AppBar;
