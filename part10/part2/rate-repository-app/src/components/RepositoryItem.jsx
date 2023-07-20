import { View, Image, StyleSheet } from "react-native";

import Text from "./Text";

import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
  },
  detailContainer: {
    display: "flex",
    flexDirection: "row",
  },
  detailItem: {
    paddingTop: 5,
    paddingLeft: 15,
    paddingBottom: 5,
  },
  detailText: {
    marginBottom: 5,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  languageTag: {
    flexGrow: 0,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: theme.colors.primary,
  },
  statContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  statitem: {
    flexGrow: 1,
    alignItems: "center",
  },
});

const StatItem = ({ text, number }) => {
  const formatShortNumber = (num) => {
    if (num >= 1000) {
      return `${Math.round(num / 100) / 10}k`;
    } else {
      return num;
    }
  };

  return (
    <View style={styles.statitem}>
      <Text fontWeight="bold">{formatShortNumber(number)}</Text>
      <Text>{text}</Text>
    </View>
  );
};

const RepositoryItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.detailContainer}>
        <Image style={styles.tinyLogo} source={{ uri: item.ownerAvatarUrl }} />
        <View style={styles.detailItem}>
          <Text style={styles.detailText} fontSize="subheading" fontWeight="bold">{item.fullName}</Text>
          <Text style={styles.detailText}>{item.description}</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text color="white" fontWeight="bold" style={styles.languageTag}>
              {item.language}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.statContainer}>
        <StatItem text="Stars" number={item.stargazersCount} />
        <StatItem text="Forks" number={item.forksCount} />
        <StatItem text="Reviews" number={item.reviewCount} />
        <StatItem text="Rating" number={item.ratingAverage} />
      </View>
    </View>
  );
};

export default RepositoryItem;
