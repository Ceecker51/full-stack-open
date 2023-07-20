import { StyleSheet, View } from "react-native";

import AppBar from "./AppBar";
import RepositoryList from "./RepositoryList";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <>
      <AppBar />
      {/* <Text>Simple Text</Text>
      <Text style={{paddingBottom: 10}}>Text with custom style</Text>
      <Text fontWeight='bold' fontSize="subheading">
        Bold subheading
      </Text>
      <Text color="textSecondary">Text with secondary color</Text> */}
      <RepositoryList />
    </>
  );
};

export default Main;
