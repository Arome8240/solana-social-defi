import { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { Link, router } from "expo-router";
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
import { useAuth } from "@/hooks/use-auth";
import { Lock, Sms } from "iconsax-react-nativejs";
import { LogIn } from "lucide-react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(20);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0);

    formOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    formTranslateY.value = withDelay(200, withSpring(0));

    footerOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: async (data) => {
      await setAuth(data.user, data.token);
      toast.success("Welcome back!", {
        description: `Logged in as ${data.user.username}`,
      });
      router.replace("/(app)/home");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Login failed";
      toast.error("Login Failed", {
        description: message,
      });
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("Missing Fields", {
        description: "Please enter both email and password",
      });
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-20">
          {/* Header */}
          <Animated.View style={headerAnimatedStyle} className="mb-12">
            <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <LogIn size={32} color="#3b82f6" strokeWidth={2} />
            </View>
            <Text className="text-4xl font-bold text-gray-900">
              Welcome back
            </Text>
            <Text className="mt-2 text-base text-gray-600">
              Sign in to continue to your account
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={formAnimatedStyle} className="gap-4">
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Sms size={18} color="#374151" />
                <Text className="text-sm font-medium text-gray-700">Email</Text>
              </View>
              <Input
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loginMutation.isPending}
              />
            </View>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Lock size={18} color="#374151" />
                <Text className="text-sm font-medium text-gray-700">
                  Password
                </Text>
              </View>
              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!loginMutation.isPending}
              />
            </View>

            <Button
              onPress={handleLogin}
              disabled={loginMutation.isPending}
              className="mt-2 h-12 bg-blue-600 active:bg-blue-700"
            >
              <Text className="text-base font-semibold text-white">
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Text>
            </Button>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={footerAnimatedStyle}
            className="mt-8 items-center"
          >
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-gray-600">
                Don&apos;t have an account?
              </Text>
              <Link href="/(auth)/signup" asChild>
                <Pressable>
                  <Text className="text-sm font-semibold text-blue-600">
                    Sign up
                  </Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
