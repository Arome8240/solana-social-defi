import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/use-auth";
import { walletAPI } from "@/lib/api";
import {
  Eye,
  EyeSlash,
  Send2,
  ReceiveSquare2,
  ArrowSwapHorizontal,
  Notification,
} from "iconsax-react-nativejs";
import { Sparkles } from "lucide-react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const headerOpacity = useSharedValue(0);
  const walletOpacity = useSharedValue(0);
  const walletScale = useSharedValue(0.9);
  const actionsOpacity = useSharedValue(0);
  const feedOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    walletOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    walletScale.value = withDelay(200, withSpring(1));
    actionsOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    feedOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
  }, [actionsOpacity, feedOpacity, headerOpacity, walletOpacity, walletScale]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const walletAnimatedStyle = useAnimatedStyle(() => ({
    opacity: walletOpacity.value,
    transform: [{ scale: walletScale.value }],
  }));

  const actionsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
  }));

  const feedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedOpacity.value,
  }));

  const { data: walletData, refetch: refetchWallet } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: walletAPI.getBalance,
    enabled: !!user,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchWallet();
    setRefreshing(false);
  };

  const balance = walletData?.totalUSD || 6291.0;
  const solBalance = walletData?.solBalance || 24.56;
  const skrBalance = walletData?.skrBalance || 503.33;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={headerAnimatedStyle}
          className="px-6 pt-4 pb-2 flex-row items-center justify-between"
        >
          <Text className="text-2xl font-bold text-gray-900">Home</Text>
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
            <Notification size={24} color="#374151" variant="Bold" />
          </Pressable>
        </Animated.View>

        <View className="px-6">
          {/* Wallet Card */}
          <Animated.View
            style={walletAnimatedStyle}
            className="mb-6 overflow-hidden rounded-3xl"
          >
            <LinearGradient
              colors={["#8b5cf6", "#7c3aed"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              {/* Balance Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-sm font-medium text-purple-100">
                  Total Balance
                </Text>
                <Pressable
                  onPress={() => setBalanceVisible(!balanceVisible)}
                  className="active:opacity-70"
                >
                  {balanceVisible ? (
                    <Eye size={20} color="#e9d5ff" variant="Bold" />
                  ) : (
                    <EyeSlash size={20} color="#e9d5ff" variant="Bold" />
                  )}
                </Pressable>
              </View>

              {/* Balance Amount */}
              <Text className="text-4xl font-bold text-white mb-2">
                {balanceVisible ? `$${balance.toFixed(2)}` : "••••••"}
              </Text>

              {/* Token Balances */}
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm text-purple-100">SOL</Text>
                  <Text className="text-sm font-semibold text-white">
                    {balanceVisible ? solBalance.toFixed(2) : "••••"}
                  </Text>
                </View>
                <View className="h-1 w-1 rounded-full bg-purple-200" />
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm text-purple-100">SKR</Text>
                  <Text className="text-sm font-semibold text-white">
                    {balanceVisible ? skrBalance.toFixed(2) : "••••"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={actionsAnimatedStyle} className="mb-6">
            <View className="flex-row gap-3">
              <QuickActionButton
                icon={<Send2 size={24} color="#8b5cf6" variant="Bold" />}
                label="Send"
                onPress={() => router.push("/(app)/home/send")}
              />
              <QuickActionButton
                icon={
                  <ReceiveSquare2 size={24} color="#8b5cf6" variant="Bold" />
                }
                label="Receive"
                onPress={() => router.push("/(app)/home/receive")}
              />
              <QuickActionButton
                icon={
                  <ArrowSwapHorizontal
                    size={24}
                    color="#8b5cf6"
                    variant="Bold"
                  />
                }
                label="Swap"
                onPress={() => router.push("/(app)/home/swap")}
              />
            </View>
          </Animated.View>

          {/* ExploreMini Apps Banner */}
          <Animated.View style={actionsAnimatedStyle} className="mb-6">
            <Pressable
              onPress={() => router.push("/home/mini-apps")}
              className="overflow-hidden rounded-2xl active:opacity-90"
            >
              <LinearGradient
                colors={["#8b5cf6", "#7c3aed"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <Sparkles size={24} color="#ffffff" />
                  </View>
                  <View>
                    <Text className="text-base font-bold text-white">
                      Explore Mini Apps
                    </Text>
                    <Text className="text-sm text-purple-100">
                      Discover apps and tools built on Solana
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Feed Section */}
          <Animated.View style={feedAnimatedStyle} className="pb-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">Feed</Text>
              <Pressable onPress={() => router.push("/(app)/social")}>
                <Text className="text-sm font-semibold text-purple-600">
                  Explore
                </Text>
              </Pressable>
            </View>

            {/* Feed Posts */}
            <View className="gap-4">
              <FeedPost
                username="Solana-Princess"
                handle="@solanaqueen"
                time="2h"
                content="Just deployed my FIRST EVER SOLANA PROGRAM! The speed is incredible ✨"
                likes={24}
                comments={7}
              />
              <FeedPost
                username="NFT Creator"
                handle="@nftcreator"
                time="5h"
                content="New NFT COLLECTION dropping on Solana Mobile! Exclusive early access for followers 🎨"
                image="https://via.placeholder.com/400x200"
                likes={89}
                comments={23}
              />
              <FeedPost
                username="Solana-Princess"
                handle="@solanaqueen"
                time="8h"
                content="Just deployed my FIRST EVER SOLANA PROGRAM! The speed is incredible ✨"
                likes={45}
                comments={12}
              />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickActionButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center gap-2 rounded-2xl bg-gray-50 py-4 active:bg-gray-100"
    >
      {icon}
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
    </Pressable>
  );
}

function FeedPost({
  username,
  handle,
  time,
  content,
  image,
  likes,
  comments,
}: {
  username: string;
  handle: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}) {
  return (
    <Pressable className="rounded-2xl bg-white p-4 active:bg-gray-50">
      {/* Post Header */}
      <View className="mb-3 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-100">
          <Text className="text-base font-bold text-purple-600">
            {username.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900">
            {username}
          </Text>
          <Text className="text-xs text-gray-500">
            {handle} · {time}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <Text className="mb-3 text-sm leading-5 text-gray-700">{content}</Text>

      {/* Post Image */}
      {image && (
        <View className="mb-3 h-48 overflow-hidden rounded-xl bg-gray-100" />
      )}

      {/* Post Actions */}
      <View className="flex-row items-center gap-6">
        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-gray-500">❤️</Text>
          <Text className="text-xs font-medium text-gray-600">{likes}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-gray-500">💬</Text>
          <Text className="text-xs font-medium text-gray-600">{comments}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-gray-500">🔁</Text>
        </View>
      </View>
    </Pressable>
  );
}
