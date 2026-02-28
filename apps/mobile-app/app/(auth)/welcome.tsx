import { View, Pressable, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import PagerView from "react-native-pager-view";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Sparkles } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ONBOARDING_PAGES = [
  {
    id: 1,
    icon: Zap,
    title: "Lightning Fast\nPayments",
    description: "Send and receive money in seconds\nwith Solana's speed",
    color: "#8b5cf6",
  },
  {
    id: 2,
    icon: Shield,
    title: "Your Wallet,\nYour Keys",
    description: "Secure, self-custodial wallet created\njust for you",
    color: "#8b5cf6",
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Welcome to\nSolana Social",
    description: "Your all-in-one super app for\npayments, social and more",
    color: "#8b5cf6",
  },
];

export default function WelcomeScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleCreateAccount = () => {
    router.push("/(auth)/signup-step1");
  };

  const handleSignIn = () => {
    router.push("/(auth)/login");
  };

  const isLastPage = currentPage === ONBOARDING_PAGES.length - 1;

  return (
    <View className="flex-1 bg-white">
      {/* Status Bar Space */}
      <View className="h-12" />

      {/* Pager */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {ONBOARDING_PAGES.map((page, index) => (
          <View key={page.id} className="flex-1">
            <OnboardingPage
              page={page}
              index={index}
              isActive={currentPage === index}
            />
          </View>
        ))}
      </PagerView>

      {/* Bottom Section */}
      <View className="px-6 pb-12">
        {/* Page Indicators */}
        <View className="mb-8 flex-row items-center justify-center gap-2">
          {ONBOARDING_PAGES.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                currentPage === index
                  ? "w-8 bg-purple-600"
                  : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View className="gap-4">
          <Button
            onPress={handleCreateAccount}
            className="h-14 rounded-2xl bg-purple-600 active:bg-purple-700"
          >
            <Text className="text-base font-semibold text-white">
              Create Account
            </Text>
          </Button>

          <Pressable
            onPress={handleSignIn}
            className="items-center py-3 active:opacity-70"
          >
            <Text className="text-base font-semibold text-purple-600">
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function OnboardingPage({
  page,
  index,
  isActive,
}: {
  page: (typeof ONBOARDING_PAGES)[0];
  index: number;
  isActive: boolean;
}) {
  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    if (isActive) {
      // Reset and animate
      iconScale.value = 0;
      iconOpacity.value = 0;
      contentOpacity.value = 0;
      contentTranslateY.value = 30;

      iconScale.value = withDelay(100, withSpring(1, { damping: 12 }));
      iconOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));

      contentOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
      contentTranslateY.value = withDelay(300, withSpring(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const IconComponent = page.icon;

  return (
    <View className="flex-1 items-center justify-center px-8">
      {/* Icon */}
      <Animated.View
        style={[
          iconAnimatedStyle,
          {
            marginBottom: 64,
            height: 100,
            width: 100,
            borderRadius: 50,
            backgroundColor: "#f3e8ff",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <IconComponent size={48} color={page.color} strokeWidth={2.5} />
      </Animated.View>

      {/* Content */}
      <Animated.View style={contentAnimatedStyle} className="items-center">
        <Text className="text-center text-3xl font-bold leading-tight text-gray-900">
          {page.title}
        </Text>
        <Text className="mt-4 text-center text-base leading-6 text-gray-500">
          {page.description}
        </Text>
      </Animated.View>
    </View>
  );
}
