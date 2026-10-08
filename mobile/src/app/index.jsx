import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}