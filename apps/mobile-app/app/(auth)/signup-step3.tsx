import { useState, useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
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
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { ChevronLeft } from "lucide-react-native";

export default function SignupStep3Screen() {
  const params = useLocalSearchParams<{
    fullName: string;
    username: string;
    bio: string;
    avatar: string;
    email: string;
  }>();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { setAuth } = useAuth();

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0);

    formOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    formTranslateY.value = withDelay(200, withSpring(0));

    // Focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 500);
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const verifyOTPMutation = useMutation({
    mutationFn: authAPI.signupVerifyOTP,
    onSuccess: async (data) => {
      await setAuth(data.user, data.token);
      toast.success("Account Created!", {
        description: `Welcome ${data.user.username}! Your wallet has been created.`,
      });
      router.replace("/(app)/home");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Invalid OTP";
      toast.error("Verification Failed", {
        description: message,
      });
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: authAPI.signupSendOTP,
    onSuccess: () => {
      toast.success("OTP Resent!", {
        description: "Check your email for the new verification code",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to resend OTP";
      toast.error("Error", {
        description: message,
      });
    },
  });

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every((digit) => digit !== "") && index === 5) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (otpCode?: string) => {
    const finalCode = otpCode || code.join("");

    if (finalCode.length !== 6) {
      toast.error("Invalid Code", {
        description: "Please enter the 6-digit code",
      });
      return;
    }

    verifyOTPMutation.mutate({
      fullName: params.fullName,
      username: params.username,
      bio: params.bio,
      email: params.email,
      code: finalCode,
    });
  };

  const handleResend = () => {
    resendOTPMutation.mutate({
      fullName: params.fullName,
      username: params.username,
      bio: params.bio,
      email: params.email,
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
              Verify Your Account
            </Text>
            <Text className="mt-2 text-base text-gray-500">
              A 6-digit code was sent to your email, enter it below to verify
              your account.
            </Text>
          </Animated.View>

          {/* OTP Input */}
          <Animated.View style={formAnimatedStyle} className="flex-1">
            <View className="flex-row justify-between gap-2">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!verifyOTPMutation.isPending}
                  className="h-14 flex-1 rounded-xl border-2 border-gray-200 bg-white text-center text-2xl font-bold text-gray-900"
                  style={{
                    borderColor: digit ? "#8b5cf6" : "#e5e7eb",
                  }}
                />
              ))}
            </View>

            {/* Resend Link */}
            <View className="mt-6 items-center">
              <Pressable
                onPress={handleResend}
                disabled={resendOTPMutation.isPending}
                className="active:opacity-70"
              >
                <Text className="text-sm text-gray-600">
                  Didn't receive code?{" "}
                  <Text className="font-semibold text-purple-600">
                    {resendOTPMutation.isPending ? "Sending..." : "Resend"}
                  </Text>
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Bottom Buttons */}
          <View className="gap-4 pb-8 pt-6">
            <Button
              onPress={() => handleVerify()}
              disabled={verifyOTPMutation.isPending || code.some((d) => !d)}
              className="h-14 rounded-2xl bg-purple-600 active:bg-purple-700"
            >
              <Text className="text-base font-semibold text-white">
                {verifyOTPMutation.isPending ? "Verifying..." : "Verify"}
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
