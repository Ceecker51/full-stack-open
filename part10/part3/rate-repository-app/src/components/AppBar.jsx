import Constants from "expo-constants";
import { View, StyleSheet, ScrollView } from "react-native";

import AppBarTab from "./AppBarTab";

import theme from "../theme";
import useAuthorized from "../hooks/useAuthorized";
import { useNavigate } from "react-router-native";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
  scrollview: {
    backgroundColor: theme.colors.barBackground,
    display: "flex",
    flexDirection: "row",
  },
  item: {
    flexGrow: 1,

    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 20,
  },
});

const AppBar = () => {
  const { authorizedUser, signOut } = useAuthorized();
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate("/signin");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollview} horizontal>
        <AppBarTab text="Repositories" url="/" />
        {!authorizedUser ? (
          <AppBarTab text="Sign in" url="/signin" />
        ) : (
          <AppBarTab text="Sign out" onPress={logout} />
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;
