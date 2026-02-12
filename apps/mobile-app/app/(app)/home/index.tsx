import { View, ScrollView, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/use-auth";
import { authAPI } from "@/lib/api";
import { Wallet, SecurityUser } from "iconsax-react-nativejs";
import { Sparkles } from "lucide-react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const welcomeOpacity = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(-20);
  const walletOpacity = useSharedValue(0);
  const walletScale = useSharedValue(0.9);
  const statsOpacity = useSharedValue(0);
  const infoOpacity = useSharedValue(0);

  useEffect(() => {
    welcomeOpacity.value = withTiming(1, { duration: 600 });
    welcomeTranslateY.value = withSpring(0);

    walletOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    walletScale.value = withDelay(200, withSpring(1));

    statsOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    infoOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
  }, []);

  const welcomeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: welcomeOpacity.value,
    transform: [{ translateY: welcomeTranslateY.value }],
  }));

  const walletAnimatedStyle = useAnimatedStyle(() => ({
    opacity: walletOpacity.value,
    transform: [{ scale: walletScale.value }],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const infoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: infoOpacity.value,
  }));

  const { data: walletData, refetch } = useQuery({
    queryKey: ["wallet"],
    queryFn: authAPI.getWallet,
    enabled: !!user,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 pt-6">
          {/* Welcome Header */}
          <Animated.View style={welcomeAnimatedStyle} className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">
              Welcome back,
            </Text>
            <Text className="text-3xl font-bold text-blue-600">
              {user?.username}!
            </Text>
          </Animated.View>

          {/* Wallet Card */}
          <Animated.View
            style={walletAnimatedStyle}
            className="mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-lg"
          >
            <View className="flex-row items-center gap-2">
              <Wallet size={24} color="#ffffff" variant="Bold" />
              <Text className="text-lg font-semibold text-white">
                Your Wallet
              </Text>
            </View>
            <View className="mt-4">
              <Text className="text-sm text-blue-100">Balance</Text>
              <Text className="mt-1 text-3xl font-bold text-white">
                {walletData?.balance || "0.00"} SOL
              </Text>
            </View>
            <View className="mt-4 rounded-lg bg-white/10 p-3">
              <Text className="text-xs text-blue-100">Address</Text>
              <Text className="mt-1 text-xs text-white" numberOfLines={1}>
                {user?.walletAddress}
              </Text>
            </View>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View style={statsAnimatedStyle} className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              Quick Stats
            </Text>
            <View className="flex-row gap-3">
              <StatCard
                icon={<SecurityUser size={24} color="#3b82f6" variant="Bold" />}
                label="Account Type"
                value={user?.role || "User"}
              />
              <StatCard
                icon={<Wallet size={24} color="#10b981" variant="Bold" />}
                label="Wallet Status"
                value="Active"
              />
            </View>
          </Animated.View>

          {/* Info Box */}
          <Animated.View
            style={infoAnimatedStyle}
            className="rounded-lg bg-blue-50 p-4"
          >
            <View className="flex-row items-center gap-2">
              <Sparkles size={20} color="#1e40af" strokeWidth={2} />
              <Text className="text-sm font-semibold text-blue-900">
                Welcome to Solana Social
              </Text>
            </View>
            <Text className="mt-2 text-sm text-blue-700">
              Your custodial wallet has been created and is ready to use. Start
              exploring social features, earn rewards, and manage your crypto
              assets.
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-lg bg-gray-50 p-4">
      <View className="mb-2">{icon}</View>
      <Text className="text-xs text-gray-600">{label}</Text>
      <Text className="mt-1 text-base font-semibold text-gray-900">
        {value}
      </Text>
    </View>
  );
}
