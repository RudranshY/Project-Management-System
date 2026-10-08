import { Stack } from "expo-router";

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="login"
          options={{
            title: "Login",
          }}
        />

        <Stack.Screen
          name="register"
          options={{
            title: "Register",
          }}
        />
        

        <Stack.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
          }}
        />
        <Stack.Screen
  name="projects"
  options={{
    title: "Projects",
  }}
/>
<Stack.Screen
  name="projects/[id]"
  options={{
    title: "Project",
  }}
/>

<Stack.Screen
  name="projects/[id]/tasks"
  options={{
    title: "Tasks",
  }}
/>
      </Stack>
    </AuthProvider>
  );
}