import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { Fragment, useEffect } from "react";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Toaster } from "sonner-native";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function RootLayoutNav() {
  const { isAuthenticated, isLoading, initialize } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to welcome if not authenticated
      router.replace("/(auth)/welcome");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to app if authenticated
      router.replace("/(app)/home");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
      <StatusBar style="auto" />
      <Toaster position="top-center" theme="dark" richColors={true} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider value={DarkTheme}>
            <RootLayoutNav />
          </ThemeProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Fragment>
  );
}
