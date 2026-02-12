import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { walletAPI } from "@/lib/api";
import {
  ArrowLeft,
  Wallet,
  Copy,
  Eye,
  EyeSlash,
  Send,
  ReceiveSquare,
} from "iconsax-react-nativejs";
import { useState } from "react";

export default function WalletScreen() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  const { data: walletData } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: walletAPI.getBalance,
  });

  const handleCopyAddress = async () => {
    if (user?.walletAddress) {
      await Clipboard.setStringAsync(user.walletAddress);
      toast.success("Copied!", {
        description: "Wallet address copied to clipboard",
      });
    }
  };

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
                My Wallet
              </Text>
              <Text className="text-sm text-gray-600">
                Manage your crypto assets
              </Text>
            </View>
          </View>

          {/* Balance Card */}
          <View className="mb-6 overflow-hidden rounded-2xl">
            <LinearGradient
              colors={["#2563eb", "#1d4ed8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Wallet size={24} color="#ffffff" variant="Bold" />
                  <Text className="text-lg font-semibold text-white">
                    Total Balance
                  </Text>
                </View>
                <Pressable onPress={() => setShowBalance(!showBalance)}>
                  {showBalance ? (
                    <Eye size={24} color="#ffffff" variant="Bold" />
                  ) : (
                    <EyeSlash size={24} color="#ffffff" variant="Bold" />
                  )}
                </Pressable>
              </View>

              <Text className="text-4xl font-bold text-white">
                {showBalance
                  ? `$${walletData?.totalUSD?.toFixed(2) || "0.00"}`
                  : "••••••"}
              </Text>
              <Text className="mt-1 text-sm text-blue-100">
                {showBalance
                  ? `${walletData?.solBalance?.toFixed(4) || "0.0000"} SOL`
                  : "•••• SOL"}
              </Text>
            </LinearGradient>
          </View>

          {/* Quick Actions */}
          <View className="mb-6 flex-row gap-3">
            <View className="flex-1">
              <Button
                onPress={() => router.push("/(app)/home/send")}
                className="bg-blue-600 active:bg-blue-700"
              >
                <View className="flex-row items-center gap-2">
                  <Send size={20} color="#ffffff" variant="Bold" />
                  <Text className="text-base font-semibold text-white">
                    Send
                  </Text>
                </View>
              </Button>
            </View>
            <View className="flex-1">
              <Button
                onPress={() => router.push("/(app)/home/receive")}
                variant="outline"
              >
                <View className="flex-row items-center gap-2">
                  <ReceiveSquare size={20} color="#374151" variant="Bold" />
                  <Text className="text-base font-semibold text-gray-900">
                    Receive
                  </Text>
                </View>
              </Button>
            </View>
          </View>

          {/* Wallet Address */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Wallet Address
            </Text>
            <Pressable
              onPress={handleCopyAddress}
              className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4 active:bg-gray-100"
            >
              <Text className="flex-1 text-sm text-gray-900" numberOfLines={1}>
                {user?.walletAddress}
              </Text>
              <Copy size={20} color="#6b7280" />
            </Pressable>
          </View>

          {/* Token Holdings */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              Token Holdings
            </Text>
            <View className="gap-2">
              <TokenHolding
                symbol="SOL"
                name="Solana"
                balance={walletData?.solBalance || 0}
                usdValue={walletData?.solUSD || 0}
                change24h={2.5}
              />
              <TokenHolding
                symbol="USDC"
                name="USD Coin"
                balance={walletData?.usdcBalance || 0}
                usdValue={walletData?.usdcBalance || 0}
                change24h={0.01}
              />
              <TokenHolding
                symbol="SKR"
                name="Seeker Token"
                balance={walletData?.skrBalance || 0}
                usdValue={walletData?.skrUSD || 0}
                change24h={5.2}
              />
            </View>
          </View>

          {/* Network Info */}
          <View className="mb-6 rounded-lg bg-blue-50 p-4">
            <Text className="mb-2 text-sm font-medium text-blue-900">
              Network Information
            </Text>
            <View className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-blue-700">Network</Text>
                <Text className="text-sm font-medium text-blue-900">
                  Solana Mainnet
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-blue-700">Status</Text>
                <Text className="text-sm font-medium text-green-600">
                  ● Active
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TokenHolding({
  symbol,
  name,
  balance,
  usdValue,
  change24h,
}: {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
}) {
  const isPositive = change24h >= 0;

  return (
    <Pressable className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4 active:bg-gray-100">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
          <Text className="text-lg font-bold text-gray-700">
            {symbol.charAt(0)}
          </Text>
        </View>
        <View>
          <Text className="font-semibold text-gray-900">{symbol}</Text>
          <Text className="text-xs text-gray-500">{name}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-gray-900">
          {balance.toFixed(4)}
        </Text>
        <Text className="text-xs text-gray-500">${usdValue.toFixed(2)}</Text>
        <Text
          className={`text-xs font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {change24h.toFixed(2)}%
        </Text>
      </View>
    </Pressable>
  );
}
