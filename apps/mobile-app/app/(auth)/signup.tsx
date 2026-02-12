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
import { User, Sms, Lock, Shield } from "iconsax-react-nativejs";
import { UserPlus } from "lucide-react-native";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setAuth } = useAuth();

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(20);
  const infoOpacity = useSharedValue(0);
  const infoScale = useSharedValue(0.9);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0);

    formOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    formTranslateY.value = withDelay(200, withSpring(0));

    infoOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    infoScale.value = withDelay(400, withSpring(1));

    footerOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const infoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: infoOpacity.value,
    transform: [{ scale: infoScale.value }],
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: async (data) => {
      await setAuth(data.user, data.token);
      toast.success("Account Created!", {
        description: `Welcome ${data.user.username}! Your wallet has been created.`,
      });
      router.replace("/(app)/home");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Signup failed";
      toast.error("Signup Failed", {
        description: message,
      });
    },
  });

  const handleSignup = () => {
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Missing Fields", {
        description: "Please fill in all fields",
      });
      return;
    }

    if (username.length < 3) {
      toast.error("Invalid Username", {
        description: "Username must be at least 3 characters",
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Weak Password", {
        description: "Password must be at least 8 characters",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password Mismatch", {
        description: "Passwords do not match",
      });
      return;
    }

    signupMutation.mutate({ username, email, password });
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
              <UserPlus size={32} color="#3b82f6" strokeWidth={2} />
            </View>
            <Text className="text-4xl font-bold text-gray-900">
              Create account
            </Text>
            <Text className="mt-2 text-base text-gray-600">
              Sign up to get started with your Solana wallet
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={formAnimatedStyle} className="gap-4">
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <User size={18} color="#374151" />
                <Text className="text-sm font-medium text-gray-700">
                  Username
                </Text>
              </View>
              <Input
                placeholder="johndoe"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                editable={!signupMutation.isPending}
              />
            </View>

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
                editable={!signupMutation.isPending}
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
                placeholder="At least 8 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                editable={!signupMutation.isPending}
              />
            </View>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Shield size={18} color="#374151" />
                <Text className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Text>
              </View>
              <Input
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!signupMutation.isPending}
              />
            </View>

            <Button
              onPress={handleSignup}
              disabled={signupMutation.isPending}
              className="mt-2 h-12 bg-blue-600 active:bg-blue-700"
            >
              <Text className="text-base font-semibold text-white">
                {signupMutation.isPending
                  ? "Creating account..."
                  : "Create account"}
              </Text>
            </Button>
          </Animated.View>

          {/* Info Box */}
          <Animated.View
            style={infoAnimatedStyle}
            className="mt-6 rounded-lg bg-blue-50 p-4"
          >
            <View className="flex-row items-center gap-2">
              <Shield size={20} color="#1e40af" variant="Bold" />
              <Text className="text-sm font-medium text-blue-900">
                Secure Wallet
              </Text>
            </View>
            <Text className="mt-1 text-sm text-blue-700">
              A Solana wallet will be automatically created for you. You can
              export your private key anytime from settings.
            </Text>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={footerAnimatedStyle}
            className="mt-8 items-center pb-6"
          >
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-gray-600">
                Already have an account?
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-sm font-semibold text-blue-600">
                    Sign in
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
