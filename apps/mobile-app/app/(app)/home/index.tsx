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
import { walletAPI, tradingAPI, rewardsAPI } from "@/lib/api";
import {
  Wallet,
  Send,
  ReceiveSquare,
  Convert,
  TrendUp,
  Award,
  ArrowUp,
  ArrowDown,
} from "iconsax-react-nativejs";
import { ChevronRight } from "lucide-react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const welcomeOpacity = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(-20);
  const walletOpacity = useSharedValue(0);
  const walletScale = useSharedValue(0.9);
  const actionsOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    welcomeOpacity.value = withTiming(1, { duration: 600 });
    welcomeTranslateY.value = withSpring(0);

    walletOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    walletScale.value = withDelay(200, withSpring(1));

    actionsOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    contentOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const welcomeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: welcomeOpacity.value,
    transform: [{ translateY: welcomeTranslateY.value }],
  }));

  const walletAnimatedStyle = useAnimatedStyle(() => ({
    opacity: walletOpacity.value,
    transform: [{ scale: walletScale.value }],
  }));

  const actionsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const { data: walletData, refetch: refetchWallet } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: walletAPI.getBalance,
    enabled: !!user,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => walletAPI.getTransactions(5),
    enabled: !!user,
  });

  const { data: tokenPrices } = useQuery({
    queryKey: ["token-prices"],
    queryFn: tradingAPI.getTokenPrices,
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: rewards } = useQuery({
    queryKey: ["rewards"],
    queryFn: rewardsAPI.getRewards,
    enabled: !!user,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchWallet();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          {/* Welcome Header */}
          <Animated.View style={welcomeAnimatedStyle} className="mb-6">
            <Text className="text-base text-gray-600">Welcome back,</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {user?.username || "Dev Arome"}!
            </Text>
          </Animated.View>

          {/* Wallet Card */}
          <Animated.View
            style={walletAnimatedStyle}
            className="mb-6 overflow-hidden rounded-2xl shadow-lg"
          >
            <LinearGradient
              colors={["#2563eb", "#1d4ed8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className="flex-row items-center justify-between p-6">
                <View className="flex-row items-center gap-2">
                  <Wallet size={24} color="#ffffff" variant="Bold" />
                  <Text className="text-lg font-semibold text-white">
                    Total Balance
                  </Text>
                </View>
                <Pressable onPress={() => router.push("/(app)/home/wallet")}>
                  <ChevronRight size={24} color="#ffffff" />
                </Pressable>
              </View>

              <View className="mt-4 p-6">
                <Text className="text-4xl font-bold text-white">
                  ${walletData?.totalUSD?.toFixed(2) || "0.00"}
                </Text>
                <Text className="mt-1 text-sm text-blue-100">
                  {walletData?.solBalance?.toFixed(4) || "0.0000"} SOL
                </Text>
              </View>

              {walletData?.change24h !== undefined && (
                <View className="mt-3 flex-row items-center gap-1">
                  {walletData.change24h >= 0 ? (
                    <ArrowUp size={16} color="#10b981" variant="Bold" />
                  ) : (
                    <ArrowDown size={16} color="#ef4444" variant="Bold" />
                  )}
                  <Text
                    className={`text-sm font-medium ${
                      walletData.change24h >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {walletData.change24h >= 0 ? "+" : ""}
                    {walletData.change24h?.toFixed(2)}% (24h)
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={actionsAnimatedStyle} className="mb-6">
            <View className="flex-row flex-wrap gap-x-2">
              <QuickAction
                icon={<Send size={24} color="#3b82f6" variant="Bold" />}
                label="Send"
                onPress={() => router.push("/(app)/home/send")}
              />
              <QuickAction
                icon={
                  <ReceiveSquare size={24} color="#10b981" variant="Bold" />
                }
                label="Receive"
                onPress={() => router.push("/(app)/home/receive")}
              />
              <QuickAction
                icon={<Convert size={24} color="#8b5cf6" variant="Bold" />}
                label="Swap"
                onPress={() => router.push("/(app)/home/swap")}
              />
              <QuickAction
                icon={<TrendUp size={24} color="#f59e0b" variant="Bold" />}
                label="Stake"
                onPress={() => router.push("/(app)/home/stake")}
              />
            </View>
          </Animated.View>

          {/* Content Sections */}
          <Animated.View style={contentAnimatedStyle} className="gap-6 pb-6">
            {/* Rewards Section */}
            {rewards && (
              <RewardsCard
                totalRewards={rewards.totalEarned}
                availableToClaim={rewards.availableToClaim}
                onClaim={() => router.push("/(app)/home/rewards")}
              />
            )}

            {/* Token Prices */}
            {tokenPrices && tokenPrices.length > 0 && (
              <View>
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-900">
                    Market Prices
                  </Text>
                  <Pressable onPress={() => router.push("/(app)/home/markets")}>
                    <Text className="text-sm font-medium text-blue-600">
                      View All
                    </Text>
                  </Pressable>
                </View>
                <View className="gap-2">
                  {tokenPrices.slice(0, 3).map((token: any) => (
                    <TokenPriceCard key={token.symbol} token={token} />
                  ))}
                </View>
              </View>
            )}

            {/* Recent Transactions */}
            {transactions && transactions.length > 0 && (
              <View>
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </Text>
                  <Pressable
                    onPress={() => router.push("/(app)/home/transactions")}
                  >
                    <Text className="text-sm font-medium text-blue-600">
                      View All
                    </Text>
                  </Pressable>
                </View>
                <View className="gap-2">
                  {transactions.slice(0, 5).map((tx: any) => (
                    <TransactionCard key={tx.id} transaction={tx} />
                  ))}
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
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
      className="items-center gap-2 rounded-xl bg-gray-50 p-2 flex-1 active:bg-gray-100"
    >
      <View className="h-6 w-6 items-center justify-center rounded-full">
        {icon}
      </View>
      <Text className="text-xs font-medium text-gray-700">{label}</Text>
    </Pressable>
  );
}

function RewardsCard({
  totalRewards,
  availableToClaim,
  onClaim,
}: {
  totalRewards: number;
  availableToClaim: number;
  onClaim: () => void;
}) {
  return (
    <Pressable
      onPress={onClaim}
      className="overflow-hidden rounded-xl active:opacity-90"
    >
      <LinearGradient
        colors={["#f59e0b", "#ea580c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="mb-2 flex-row items-center gap-2">
              <Award size={24} color="#ffffff" variant="Bold" />
              <Text className="text-lg font-semibold text-white">
                Your Rewards
              </Text>
            </View>
            <Text className="text-3xl font-bold text-white">
              {totalRewards.toFixed(2)} SKR
            </Text>
            {availableToClaim > 0 && (
              <Text className="mt-1 text-sm text-amber-100">
                {availableToClaim.toFixed(2)} SKR available to claim
              </Text>
            )}
          </View>
          <ChevronRight size={24} color="#ffffff" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function TokenPriceCard({ token }: { token: any }) {
  const isPositive = token.change24h >= 0;

  return (
    <Pressable className="flex-row items-center justify-between rounded-xl bg-white p-4 active:bg-gray-50">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Text className="text-lg font-bold text-gray-700">
            {token.symbol.charAt(0)}
          </Text>
        </View>
        <View>
          <Text className="font-semibold text-gray-900">{token.symbol}</Text>
          <Text className="text-xs text-gray-500">{token.name}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-gray-900">
          ${token.price.toFixed(2)}
        </Text>
        <View className="flex-row items-center gap-1">
          {isPositive ? (
            <ArrowUp size={12} color="#10b981" variant="Bold" />
          ) : (
            <ArrowDown size={12} color="#ef4444" variant="Bold" />
          )}
          <Text
            className={`text-xs font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {token.change24h.toFixed(2)}%
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function TransactionCard({ transaction }: { transaction: any }) {
  const isSent = transaction.type === "send";

  return (
    <Pressable className="flex-row items-center justify-between rounded-xl bg-white p-4 active:bg-gray-50">
      <View className="flex-row items-center gap-3">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isSent ? "bg-red-50" : "bg-green-50"
          }`}
        >
          {isSent ? (
            <Send size={20} color="#ef4444" variant="Bold" />
          ) : (
            <ReceiveSquare size={20} color="#10b981" variant="Bold" />
          )}
        </View>
        <View>
          <Text className="font-semibold text-gray-900">
            {isSent ? "Sent" : "Received"}
          </Text>
          <Text className="text-xs text-gray-500">
            {new Date(transaction.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text
          className={`font-semibold ${
            isSent ? "text-red-600" : "text-green-600"
          }`}
        >
          {isSent ? "-" : "+"}
          {transaction.amount.toFixed(4)} {transaction.token}
        </Text>
        <Text className="text-xs text-gray-500">
          ${transaction.usdValue.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}
