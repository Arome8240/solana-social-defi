import AnimatedTabButton from "@/component/AnimatedTabButtons";
import { Tabs } from "expo-router";
import { Home, SearchNormal1, AddSquare, User } from "iconsax-react-nativejs";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DefaultTheme } from "@react-navigation/native";

const Layout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        animation: "shift",
        headerShown: false,
        tabBarActiveTintColor: "#1d4ed8",
        tabBarInactiveTintColor: "#7F7F7F",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Montserrat_500Medium",
        },
        tabBarButton: (props) => <AnimatedTabButton {...props} />,

        tabBarStyle: {
          height: Platform.OS === "ios" ? 56 + insets.bottom : 76,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: DefaultTheme.colors.card,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <SearchNormal1 size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="social"
        options={{
          title: "Social",
          tabBarIcon: ({ color, size }) => (
            <AddSquare size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
