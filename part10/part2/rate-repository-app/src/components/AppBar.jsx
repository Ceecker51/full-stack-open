import Constants from "expo-constants";
import { View, StyleSheet } from "react-native";

import AppBarTab from "./AppBarTab";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    
    display: 'flex',
    flexDirection: 'row'
  },
});

const AppBar = () => {
  
  return (
    <View style={styles.container}>
      <AppBarTab />
    </View>
  );
};

export default AppBar;
