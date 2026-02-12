import { View, Pressable } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import PagerView from "react-native-pager-view";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Wallet, MessageText, Award, Convert } from "iconsax-react-nativejs";
import { Rocket, ChevronRight } from "lucide-react-native";

const ONBOARDING_PAGES = [
  {
    id: 1,
    icon: <Rocket size={64} color="#3b82f6" strokeWidth={2} />,
    title: "Welcome to Solana Social",
    description:
      "Your all-in-one social DeFi platform for the Solana ecosystem",
    color: "#3b82f6",
  },
  {
    id: 2,
    icon: <Wallet size={64} color="#8b5cf6" variant="Bold" />,
    title: "Custodial Wallet",
    description:
      "Get an auto-generated Solana wallet secured by our platform. No seed phrases to remember.",
    color: "#8b5cf6",
  },
  {
    id: 3,
    icon: <MessageText size={64} color="#ec4899" variant="Bold" />,
    title: "Social Features",
    description:
      "Connect with others, share posts, like content, and engage with the community.",
    color: "#ec4899",
  },
  {
    id: 4,
    icon: <Award size={64} color="#f59e0b" variant="Bold" />,
    title: "Earn Rewards",
    description:
      "Get SKR tokens for your engagement. Create content, interact, and earn crypto.",
    color: "#f59e0b",
  },
  {
    id: 5,
    icon: <Convert size={64} color="#10b981" variant="Bold" />,
    title: "DeFi & Trading",
    description:
      "Stake your tokens, lend assets, swap cryptocurrencies, and explore DeFi opportunities.",
    color: "#10b981",
  },
];

export default function WelcomeScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);

  useEffect(() => {
    // Logo animation
    logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    logoRotate.value = withSequence(
      withTiming(10, { duration: 200 }),
      withTiming(-10, { duration: 200 }),
      withTiming(0, { duration: 200 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (currentPage < ONBOARDING_PAGES.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      router.push("/(auth)/signup");
    }
  };

  const handleSkip = () => {
    router.push("/(auth)/login");
  };

  const isLastPage = currentPage === ONBOARDING_PAGES.length - 1;

  return (
    <View className="flex-1 bg-white">
      {/* Skip Button */}
      {!isLastPage && (
        <View className="absolute right-6 top-16 z-10">
          <Pressable onPress={handleSkip}>
            <Text className="text-base font-semibold text-gray-600">Skip</Text>
          </Pressable>
        </View>
      )}

      {/* Pager */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {ONBOARDING_PAGES.map((page, index) => (
          <View key={page.id} className="flex-1 px-6">
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
        <View className="mb-6 flex-row items-center justify-center gap-2">
          {ONBOARDING_PAGES.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => pagerRef.current?.setPage(index)}
            >
              <View
                className={`h-2 rounded-full transition-all ${
                  currentPage === index ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
                }`}
              />
            </Pressable>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          <Button
            onPress={handleNext}
            className="h-12 bg-blue-600 active:bg-blue-700"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-semibold text-white">
                {isLastPage ? "Get Started" : "Next"}
              </Text>
              {!isLastPage && <ChevronRight size={20} color="#ffffff" />}
            </View>
          </Button>

          {isLastPage && (
            <Button
              onPress={() => router.push("/(auth)/login")}
              variant="outline"
              className="h-12"
            >
              <Text className="text-base font-semibold text-gray-900">
                I already have an account
              </Text>
            </Button>
          )}
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

  return (
    <View className="flex-1 items-center justify-center">
      {/* Icon */}
      <Animated.View
        style={[
          iconAnimatedStyle,
          {
            marginBottom: 48,
            height: 120,
            width: 120,
            borderRadius: 60,
            backgroundColor: `${page.color}15`,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {page.icon}
      </Animated.View>

      {/* Content */}
      <Animated.View style={contentAnimatedStyle} className="items-center">
        <Text className="text-center text-3xl font-bold text-gray-900">
          {page.title}
        </Text>
        <Text className="mt-4 text-center text-base leading-6 text-gray-600">
          {page.description}
        </Text>

        {/* Feature Highlights for first page */}
        {/* {index === 0 && (
          <View className="mt-12 w-full gap-3">
            <FeatureHighlight
              icon={<Wallet size={20} color="#3b82f6" variant="Bold" />}
              text="Secure custodial wallet"
            />
            <FeatureHighlight
              icon={<MessageText size={20} color="#3b82f6" variant="Bold" />}
              text="Social engagement platform"
            />
            <FeatureHighlight
              icon={<Award size={20} color="#3b82f6" variant="Bold" />}
              text="Earn crypto rewards"
            />
            <FeatureHighlight
              icon={<Convert size={20} color="#3b82f6" variant="Bold" />}
              text="DeFi trading features"
            />
          </View>
        )} */}
      </Animated.View>
    </View>
  );
}

function FeatureHighlight({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
        {icon}
      </View>
      <Text className="flex-1 text-sm font-medium text-gray-700">{text}</Text>
    </View>
  );
}
