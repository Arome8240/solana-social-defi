import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { tradingAPI } from "@/lib/api";
import { ArrowLeft, ArrowUp, ArrowDown, TrendUp } from "iconsax-react-nativejs";

export default function MarketsScreen() {
  const { data: tokenPrices, isLoading } = useQuery({
    queryKey: ["token-prices-all"],
    queryFn: tradingAPI.getTokenPrices,
    refetchInterval: 30000,
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6">
          {/* Header */}
          <View className="mb-8 flex-row items-center gap-4">
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color="#111827" />
            </Pressable>
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Market Prices
              </Text>
              <Text className="text-sm text-gray-600">
                Live cryptocurrency prices
              </Text>
            </View>
          </View>

          {/* Market Stats */}
          <View className="mb-6 flex-row gap-3">
            <View className="flex-1 rounded-xl bg-green-50 p-4">
              <View className="mb-1 flex-row items-center gap-1">
                <TrendUp size={16} color="#10b981" variant="Bold" />
                <Text className="text-xs text-green-700">24h Volume</Text>
              </View>
              <Text className="text-xl font-bold text-green-900">$2.4B</Text>
            </View>
            <View className="flex-1 rounded-xl bg-blue-50 p-4">
              <View className="mb-1 flex-row items-center gap-1">
                <TrendUp size={16} color="#3b82f6" variant="Bold" />
                <Text className="text-xs text-blue-700">Market Cap</Text>
              </View>
              <Text className="text-xl font-bold text-blue-900">$45.2B</Text>
            </View>
          </View>

          {/* Token List */}
          {isLoading ? (
            <View className="items-center py-12">
              <Text className="text-gray-500">Loading prices...</Text>
            </View>
          ) : tokenPrices && tokenPrices.length > 0 ? (
            <View className="gap-2 pb-6">
              {tokenPrices.map((token: any) => (
                <TokenCard key={token.symbol} token={token} />
              ))}
            </View>
          ) : (
            <View className="items-center py-12">
              <Text className="text-gray-500">No market data available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TokenCard({ token }: { token: any }) {
  const isPositive = token.change24h >= 0;

  return (
    <Pressable
      onPress={() => router.push("/(app)/home/swap")}
      className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4 active:bg-gray-100"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
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
        <Text className="text-lg font-bold text-gray-900">
          ${token.price.toFixed(2)}
        </Text>
        <View className="flex-row items-center gap-1">
          {isPositive ? (
            <ArrowUp size={14} color="#10b981" variant="Bold" />
          ) : (
            <ArrowDown size={14} color="#ef4444" variant="Bold" />
          )}
          <Text
            className={`text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {token.change24h.toFixed(2)}%
          </Text>
        </View>
        {token.volume24h && (
          <Text className="text-xs text-gray-500">
            Vol: ${(token.volume24h / 1000000).toFixed(2)}M
          </Text>
        )}
      </View>
    </Pressable>
  );
}
