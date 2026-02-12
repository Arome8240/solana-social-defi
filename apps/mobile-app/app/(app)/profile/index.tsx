import { View, ScrollView, Pressable, Alert } from "react-native";
import { useEffect } from "react";
import { toast } from "sonner-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  LogoutCurve,
  Wallet,
  SecurityUser,
  Setting2,
} from "iconsax-react-nativejs";
import { ChevronRight } from "lucide-react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const headerOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.9);
  const walletOpacity = useSharedValue(0);
  const walletTranslateY = useSharedValue(20);
  const menuOpacity = useSharedValue(0);
  const logoutOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerScale.value = withSpring(1);

    walletOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    walletTranslateY.value = withDelay(200, withSpring(0));

    menuOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    logoutOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: headerScale.value }],
  }));

  const walletAnimatedStyle = useAnimatedStyle(() => ({
    opacity: walletOpacity.value,
    transform: [{ translateY: walletTranslateY.value }],
  }));

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
  }));

  const logoutAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoutOpacity.value,
  }));

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          toast.success("Logged out successfully");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16">
        {/* Profile Header */}
        <Animated.View
          style={headerAnimatedStyle}
          className="items-center py-8"
        >
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-blue-600 shadow-lg">
            <Text className="text-4xl font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {user.username}
          </Text>
          <Text className="mt-1 text-base text-gray-600">{user.email}</Text>
          <View className="mt-3 rounded-full bg-blue-50 px-3 py-1">
            <Text className="text-sm font-medium text-blue-600">
              {user.role}
            </Text>
          </View>
        </Animated.View>

        {/* Wallet Info */}
        <Animated.View
          style={walletAnimatedStyle}
          className="mb-6 rounded-lg bg-gray-50 p-4"
        >
          <View className="flex-row items-center gap-2">
            <Wallet size={20} color="#3b82f6" variant="Bold" />
            <Text className="text-sm font-semibold text-gray-900">
              Wallet Address
            </Text>
          </View>
          <Text className="mt-2 text-xs text-gray-600" numberOfLines={1}>
            {user.walletAddress}
          </Text>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View style={menuAnimatedStyle} className="gap-2">
          <MenuItem
            icon={<SecurityUser size={24} color="#374151" variant="Bold" />}
            title="Security Settings"
            onPress={() => toast.info("Coming soon")}
          />
          <MenuItem
            icon={<Setting2 size={24} color="#374151" variant="Bold" />}
            title="App Settings"
            onPress={() => toast.info("Coming soon")}
          />
        </Animated.View>

        {/* Logout Button */}
        <Animated.View style={logoutAnimatedStyle} className="mt-8 pb-8">
          <Button
            onPress={handleLogout}
            variant="outline"
            className="h-12 border-red-200"
          >
            <View className="flex-row items-center gap-2">
              <LogoutCurve size={20} color="#dc2626" variant="Bold" />
              <Text className="text-base font-semibold text-red-600">
                Logout
              </Text>
            </View>
          </Button>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-lg bg-gray-50 p-4 active:bg-gray-100"
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className="text-base font-medium text-gray-900">{title}</Text>
      </View>
      <ChevronRight size={20} color="#9ca3af" strokeWidth={2} />
    </Pressable>
  );
}
