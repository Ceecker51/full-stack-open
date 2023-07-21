import { useQuery, useApolloClient } from "@apollo/client";

import { useAuthStorage } from "./useAuthStorage";
import { ME } from "../graphql/queries";

const useAuthorized = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const { data, error, loading } = useQuery(ME, {
    fetchPolicy: "cache-and-network",
  });

  const signOut = async () => {
    await authStorage.removeAccessToken();
    apolloClient.resetStore();
  };

  return { authorizedUser: data ? data.me : undefined, loading, signOut };
};

export default useAuthorized;
