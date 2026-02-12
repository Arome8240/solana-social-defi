import '../global.css';
import { Stack } from "expo-router";
import { Fragment } from "react";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Toaster } from "sonner-native";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });



  return (
    <Fragment>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={DarkTheme}><Stack screenOptions={{ headerShown: false }} />
          <PortalHost />
          <StatusBar style="auto" />
          <Toaster position="top-center" theme='dark' richColors={true} />
        </ThemeProvider>
      </GestureHandlerRootView>
    </Fragment>);
}
