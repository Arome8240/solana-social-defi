import { View, ScrollView, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tradingAPI, walletAPI } from "@/lib/api";
import { Convert, ArrowLeft, ArrowDown2 } from "iconsax-react-nativejs";

const TOKENS = [
  { symbol: "SOL", name: "Solana", balance: 0 },
  { symbol: "USDC", name: "USD Coin", balance: 0 },
  { symbol: "USDT", name: "Tether", balance: 0 },
  { symbol: "SKR", name: "Seeker Token", balance: 0 },
];

export default function SwapScreen() {
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const { data: walletData } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: walletAPI.getBalance,
  });

  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ["swap-quote", fromToken, toToken, fromAmount],
    queryFn: () =>
      tradingAPI.getSwapQuote({
        fromToken,
        toToken,
        amount: parseFloat(fromAmount) || 0,
      }),
    enabled: !!fromAmount && parseFloat(fromAmount) > 0,
  });

  useEffect(() => {
    if (quote?.estimatedOutput) {
      setToAmount(quote.estimatedOutput.toFixed(6));
    }
  }, [quote]);

  const swapMutation = useMutation({
    mutationFn: tradingAPI.swap,
    onSuccess: () => {
      toast.success("Swap Successful!", {
        description: `Swapped ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
      });
      setFromAmount("");
      setToAmount("");
      router.back();
    },
    onError: (error: any) => {
      toast.error("Swap Failed", {
        description: error.response?.data?.error || "Failed to complete swap",
      });
    },
  });

  const handleSwap = () => {
    if (!fromAmount || !toAmount) {
      toast.error("Missing Amount", {
        description: "Please enter an amount to swap",
      });
      return;
    }

    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid amount",
      });
      return;
    }

    Alert.alert(
      "Confirm Swap",
      `Swap ${fromAmount} ${fromToken} for ~${toAmount} ${toToken}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Swap",
          onPress: () =>
            swapMutation.mutate({
              fromToken,
              toToken,
              amount,
            }),
        },
      ],
    );
  };

  const handleFlipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-6">
          {/* Header */}
          <View className="mb-8 flex-row items-center gap-4">
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color="#111827" />
            </Pressable>
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Swap Tokens
              </Text>
              <Text className="text-sm text-gray-600">
                Exchange one token for another
              </Text>
            </View>
          </View>

          {/* Swap Interface */}
          <View className="gap-4">
            {/* From Token */}
            <View className="rounded-xl bg-gray-50 p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">From</Text>
                <Text className="text-sm text-gray-600">
                  Balance: {walletData?.solBalance?.toFixed(4) || "0.0000"}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Input
                  placeholder="0.00"
                  value={fromAmount}
                  onChangeText={setFromAmount}
                  keyboardType="decimal-pad"
                  className="flex-1 border-0 bg-transparent p-0 text-2xl font-bold"
                  editable={!swapMutation.isPending}
                />
                <TokenSelector
                  selected={fromToken}
                  onSelect={setFromToken}
                  exclude={toToken}
                />
              </View>
            </View>

            {/* Flip Button */}
            <View className="items-center">
              <Pressable
                onPress={handleFlipTokens}
                className="h-10 w-10 items-center justify-center rounded-full bg-blue-600 active:bg-blue-700"
              >
                <ArrowDown2 size={20} color="#ffffff" variant="Bold" />
              </Pressable>
            </View>

            {/* To Token */}
            <View className="rounded-xl bg-gray-50 p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">To</Text>
                <Text className="text-sm text-gray-600">
                  Balance: {walletData?.usdcBalance?.toFixed(4) || "0.0000"}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Input
                  placeholder="0.00"
                  value={toAmount}
                  editable={false}
                  className="flex-1 border-0 bg-transparent p-0 text-2xl font-bold"
                />
                <TokenSelector
                  selected={toToken}
                  onSelect={setToToken}
                  exclude={fromToken}
                />
              </View>
            </View>

            {/* Swap Details */}
            {quote && (
              <View className="gap-2 rounded-lg bg-blue-50 p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">Rate</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    1 {fromToken} = {quote.rate?.toFixed(4)} {toToken}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">Price Impact</Text>
                  <Text
                    className={`text-sm font-medium ${
                      quote.priceImpact > 1 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {quote.priceImpact?.toFixed(2)}%
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">Network Fee</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    ~0.000005 SOL
                  </Text>
                </View>
              </View>
            )}

            {/* Swap Button */}
            <Button
              onPress={handleSwap}
              disabled={swapMutation.isPending || quoteLoading || !fromAmount}
              className="mt-4 bg-blue-600 active:bg-blue-700"
            >
              <View className="flex-row items-center gap-2">
                <Convert size={20} color="#ffffff" variant="Bold" />
                <Text className="text-base font-semibold text-white">
                  {swapMutation.isPending
                    ? "Swapping..."
                    : quoteLoading
                      ? "Getting Quote..."
                      : "Swap Tokens"}
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TokenSelector({
  selected,
  onSelect,
  exclude,
}: {
  selected: string;
  onSelect: (token: string) => void;
  exclude?: string;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setShowPicker(!showPicker)}
        className="flex-row items-center gap-2 rounded-lg bg-white px-3 py-2"
      >
        <Text className="text-lg font-bold text-gray-900">{selected}</Text>
        <ArrowDown2 size={16} color="#6b7280" />
      </Pressable>

      {showPicker && (
        <View className="absolute right-0 top-12 z-10 w-32 rounded-lg bg-white shadow-lg">
          {TOKENS.filter((t) => t.symbol !== exclude).map((token) => (
            <Pressable
              key={token.symbol}
              onPress={() => {
                onSelect(token.symbol);
                setShowPicker(false);
              }}
              className="border-b border-gray-100 p-3 active:bg-gray-50"
            >
              <Text className="font-semibold text-gray-900">
                {token.symbol}
              </Text>
              <Text className="text-xs text-gray-500">{token.name}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
