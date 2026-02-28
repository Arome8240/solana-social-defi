import { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { ChevronLeft } from "lucide-react-native";

export default function SignupStep2Screen() {
  const params = useLocalSearchParams<{
    fullName: string;
    username: string;
    bio: string;
    avatar: string;
  }>();

  const [email, setEmail] = useState("");

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0);

    formOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    formTranslateY.value = withDelay(200, withSpring(0));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const sendOTPMutation = useMutation({
    mutationFn: authAPI.signupSendOTP,
    onSuccess: () => {
      toast.success("OTP Sent!", {
        description: "Check your email for the verification code",
      });
      router.push({
        pathname: "/(auth)/signup-step3",
        params: {
          ...params,
          email,
        },
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to send OTP";
      toast.error("Error", {
        description: message,
      });
    },
  });

  const handleSendOTP = () => {
    if (!email.trim()) {
      toast.error("Missing Field", {
        description: "Please enter your email address",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address",
      });
      return;
    }

    sendOTPMutation.mutate({
      fullName: params.fullName,
      username: params.username,
      bio: params.bio,
      email,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-16">
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="mb-8 h-10 w-10 items-center justify-center active:opacity-70"
          >
            <ChevronLeft size={24} color="#000" />
          </Pressable>

          {/* Header */}
          <Animated.View style={headerAnimatedStyle} className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">
              Enter Your Email
            </Text>
            <Text className="mt-2 text-base text-gray-500">
              This email will be used to recover your account should you lose
              access.
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={formAnimatedStyle} className="flex-1">
            <View className="gap-2">
              <Input
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!sendOTPMutation.isPending}
                className="h-12 text-base"
              />
            </View>
          </Animated.View>

          {/* Bottom Buttons */}
          <View className="gap-4 pb-8 pt-6">
            <Button
              onPress={handleSendOTP}
              disabled={sendOTPMutation.isPending}
              className="h-14 rounded-2xl bg-purple-600 active:bg-purple-700"
            >
              <Text className="text-base font-semibold text-white">
                {sendOTPMutation.isPending ? "Sending..." : "Create Account"}
              </Text>
            </Button>

            <Pressable
              onPress={() => router.back()}
              className="items-center py-3 active:opacity-70"
            >
              <Text className="text-base font-medium text-gray-600">Back</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
