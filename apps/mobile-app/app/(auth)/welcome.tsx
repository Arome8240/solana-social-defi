import { View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
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
import {
  Wallet,
  MessageText,
  Award,
  ArrowSwapHorizontal,
} from "iconsax-react-nativejs";
import { Rocket } from "lucide-react-native";

export default function WelcomeScreen() {
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const featuresOpacity = useSharedValue(0);
  const featuresTranslateY = useSharedValue(30);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(20);

  useEffect(() => {
    // Logo animation
    logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    logoRotate.value = withSequence(
      withTiming(10, { duration: 200 }),
      withTiming(-10, { duration: 200 }),
      withTiming(0, { duration: 200 }),
    );

    // Title animation
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(300, withSpring(0));

    // Features animation
    featuresOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    featuresTranslateY.value = withDelay(600, withSpring(0));

    // Buttons animation
    buttonsOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(900, withSpring(0));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const featuresAnimatedStyle = useAnimatedStyle(() => ({
    opacity: featuresOpacity.value,
    transform: [{ translateY: featuresTranslateY.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  return (
    <View className="flex-1 bg-white px-6">
      {/* Content */}
      <View className="flex-1 justify-center">
        <View className="items-center">
          {/* Logo/Icon */}
          <Animated.View style={logoAnimatedStyle}>
            <View className="mb-8 h-24 w-24 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              <Rocket size={48} color="#ffffff" strokeWidth={2} />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View style={titleAnimatedStyle}>
            <Text className="text-center text-4xl font-bold text-gray-900">
              Solana Social
            </Text>
            <Text className="mt-3 text-center text-base text-gray-600">
              Your all-in-one social DeFi platform
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View
            style={featuresAnimatedStyle}
            className="mt-12 w-full gap-4"
          >
            <FeatureItem
              icon={<Wallet size={24} color="#3b82f6" variant="Bold" />}
              title="Custodial Wallet"
              description="Auto-generated Solana wallet"
              delay={0}
            />
            <FeatureItem
              icon={<MessageText size={24} color="#3b82f6" variant="Bold" />}
              title="Social Features"
              description="Posts, likes, and comments"
              delay={100}
            />
            <FeatureItem
              icon={<Award size={24} color="#3b82f6" variant="Bold" />}
              title="Creator Rewards"
              description="Earn SKR tokens for engagement"
              delay={200}
            />
            <FeatureItem
              icon={
                <ArrowSwapHorizontal size={24} color="#3b82f6" variant="Bold" />
              }
              title="DeFi & Trading"
              description="Stake, lend, and swap tokens"
              delay={300}
            />
          </Animated.View>
        </View>
      </View>

      {/* Actions */}
      <Animated.View style={buttonsAnimatedStyle} className="gap-3 pb-12">
        <Button
          onPress={() => router.push("/(auth)/signup")}
          className="h-12 bg-blue-600 active:bg-blue-700"
        >
          <Text className="text-base font-semibold text-white">
            Create account
          </Text>
        </Button>

        <Button
          onPress={() => router.push("/(auth)/login")}
          variant="outline"
          className="h-12"
        >
          <Text className="text-base font-semibold text-gray-900">Sign in</Text>
        </Button>
      </Animated.View>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    scale.value = withDelay(delay, withSpring(1));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="flex-row items-center gap-3"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-50">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </View>
    </Animated.View>
  );
}
