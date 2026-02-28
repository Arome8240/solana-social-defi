import { View, ScrollView, Pressable } from "react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { ChevronLeft } from "lucide-react-native";
import {
  Gameboy,
  Chart,
  VideoPlay,
  MusicDashboard,
  Wallet3,
  ShoppingCart,
} from "iconsax-react-nativejs";

const MINI_APPS = [
  {
    id: 1,
    name: "Token Swap",
    description: "Exchange tokens instantly",
    icon: "🔄",
    color: "#8b5cf6",
    bgColor: "#f3e8ff",
  },
  {
    id: 2,
    name: "Token Swap",
    description: "Exchange tokens instantly",
    icon: "🔄",
    color: "#8b5cf6",
    bgColor: "#f3e8ff",
  },
  {
    id: 3,
    name: "NFTs Gaming",
    description: "Play and earn rewards",
    icon: "🎮",
    color: "#8b5cf6",
    bgColor: "#f3e8ff",
  },
  {
    id: 4,
    name: "DeFi Dashboard",
    description: "Track yields and pools",
    icon: "📊",
    color: "#8b5cf6",
    bgColor: "#f3e8ff",
  },
  {
    id: 5,
    name: "Polls & Voting",
    description: "Create community polls",
    icon: "📊",
    color: "#8b5cf6",
    bgColor: "#f3e8ff",
  },
  {
    id: 6,
    name: "Tipping Bot",
    description: "Send tips and tips",
    icon: "💰",
    color: "#8b5cf6",
    bgColor: "#f3e8ff",
  },
];

export default function MiniAppsScreen() {
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    contentTranslateY.value = withDelay(200, withSpring(0));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <Animated.View
        style={headerAnimatedStyle}
        className="flex-row items-center gap-3 border-b border-gray-100 px-4 py-3"
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center active:opacity-70"
        >
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900">Mini Apps</Text>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={contentAnimatedStyle} className="p-6">
          {/* Description */}
          <Text className="mb-6 text-base leading-6 text-gray-600">
            Discover apps and tools built on Solana
          </Text>

          {/* Apps Grid */}
          <View className="flex-row flex-wrap gap-4">
            {MINI_APPS.map((app, index) => (
              <MiniAppCard key={app.id} app={app} index={index} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniAppCard({
  app,
  index,
}: {
  app: (typeof MINI_APPS)[0];
  index: number;
}) {
  return (
    <Pressable
      className="w-[48%] overflow-hidden rounded-3xl bg-purple-600 p-6 active:opacity-90"
      style={{ aspectRatio: 1 }}
    >
      <View className="flex-1 justify-between">
        {/* Icon */}
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <Text className="text-2xl">{app.icon}</Text>
        </View>

        {/* Content */}
        <View>
          <Text className="mb-1 text-base font-bold text-white">
            {app.name}
          </Text>
          <Text className="text-sm text-purple-100">{app.description}</Text>
        </View>
      </View>
    </Pressable>
  );
}
