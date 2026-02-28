import { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
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
import {
  ChevronLeft,
  Image as ImageIcon,
  Video,
  Smile,
} from "lucide-react-native";
import { Gallery, Camera, Microphone } from "iconsax-react-nativejs";

export default function CreatePostScreen() {
  const [content, setContent] = useState("");

  const headerOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    formOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    formTranslateY.value = withDelay(200, withSpring(0));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      // API call here
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Post Created!", {
        description: "Your post has been published",
      });
      router.back();
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to create post",
      });
    },
  });

  const handlePost = () => {
    if (!content.trim()) {
      toast.error("Empty Post", {
        description: "Please write something",
      });
      return;
    }

    createPostMutation.mutate({ content });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <Animated.View
          style={headerAnimatedStyle}
          className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3"
        >
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <ChevronLeft size={24} color="#000" />
          </Pressable>
          <Text className="text-lg font-bold text-gray-900">Create Post</Text>
          <Button
            onPress={handlePost}
            disabled={createPostMutation.isPending || !content.trim()}
            className="h-10 rounded-full bg-purple-600 px-6 active:bg-purple-700"
          >
            <Text className="text-sm font-semibold text-white">
              {createPostMutation.isPending ? "Posting..." : "Post"}
            </Text>
          </Button>
        </Animated.View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={formAnimatedStyle} className="p-4">
            {/* User Info */}
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Text className="text-lg font-bold text-purple-600">D</Text>
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900">
                  Dev Arome
                </Text>
                <Text className="text-sm text-gray-500">@devarome</Text>
              </View>
            </View>

            {/* Content Input */}
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What's happening?"
              placeholderTextColor="#9ca3af"
              multiline
              className="min-h-[200px] text-base text-gray-900"
              style={{ textAlignVertical: "top" }}
              autoFocus
            />
          </Animated.View>
        </ScrollView>

        {/* Bottom Toolbar */}
        <View className="border-t border-gray-100 px-4 py-3">
          <View className="flex-row items-center gap-4">
            <Pressable className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
              <Gallery size={24} color="#8b5cf6" variant="Bold" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
              <Camera size={24} color="#8b5cf6" variant="Bold" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
              <Microphone size={24} color="#8b5cf6" variant="Bold" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
              <Smile size={24} color="#8b5cf6" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
