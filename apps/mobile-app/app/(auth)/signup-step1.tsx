import { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { router } from "expo-router";
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
import { ChevronLeft } from "lucide-react-native";

const AVATARS = [
  require("@/assets/images/avatars/1.png"),
  require("@/assets/images/avatars/2.png"),
  require("@/assets/images/avatars/3.png"),
  require("@/assets/images/avatars/4.png"),
  require("@/assets/images/avatars/5.png"),
  require("@/assets/images/avatars/6.png"),
];

export default function SignupStep1Screen() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

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

  const handleNext = () => {
    if (!fullName.trim()) {
      toast.error("Missing Field", {
        description: "Please enter your full name",
      });
      return;
    }

    if (!username.trim()) {
      toast.error("Missing Field", {
        description: "Please enter a username",
      });
      return;
    }

    if (username.length < 3) {
      toast.error("Invalid Username", {
        description: "Username must be at least 3 characters",
      });
      return;
    }

    // Navigate to step 2 with data
    router.push({
      pathname: "/(auth)/signup-step2",
      params: {
        fullName,
        username,
        bio: bio || "",
        avatar: selectedAvatar?.toString() || "",
      },
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
              Create an Account
            </Text>
            <Text className="mt-2 text-base text-gray-500">
              Fill in the details below to get started.
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={formAnimatedStyle} className="flex-1 gap-5">
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">
                Full Name
              </Text>
              <Input
                placeholder="e.g. John Doe"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoComplete="name"
                className="h-12"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">
                Username
              </Text>
              <Input
                placeholder="e.g. johndoe"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                className="h-12"
              />
              <Text className="text-xs text-gray-500">
                Your username is{" "}
                <Text className="text-purple-600">
                  @{username || "username"}
                </Text>
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">
                Bio (Optional)
              </Text>
              <Input
                placeholder="Tell us about yourself"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                className="h-20"
                style={{ textAlignVertical: "top", paddingTop: 12 }}
              />
            </View>

            {/* Avatar Selection */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">
                Profile Picture (Optional)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-3"
              >
                {AVATARS.map((avatar, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedAvatar(index)}
                    className={`h-[58px] w-[58px] overflow-hidden rounded-full ${
                      selectedAvatar === index
                        ? "border-4 border-purple-600"
                        : "border-2 border-gray-200"
                    }`}
                  >
                    <Image
                      source={avatar}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Animated.View>

          {/* Bottom Buttons */}
          <View className="gap-4 pb-8 pt-6">
            <Button
              onPress={handleNext}
              className="h-14 rounded-2xl bg-purple-600 active:bg-purple-700"
            >
              <Text className="text-base font-semibold text-white">
                Setup your Email
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
