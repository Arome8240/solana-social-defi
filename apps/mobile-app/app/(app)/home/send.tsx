import { View, ScrollView, Pressable, Alert, Modal } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QRScanner } from "@/components/QRScanner";
import { walletAPI } from "@/lib/api";
import { Send, ArrowLeft, Scan } from "iconsax-react-nativejs";

export default function SendScreen() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("SOL");
  const [showScanner, setShowScanner] = useState(false);

  const { data: walletData } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: walletAPI.getBalance,
  });

  const sendMutation = useMutation({
    mutationFn: walletAPI.sendTransaction,
    onSuccess: () => {
      toast.success("Transaction Sent!", {
        description: "Your transaction has been successfully sent",
      });
      router.back();
    },
    onError: (error: any) => {
      toast.error("Transaction Failed", {
        description:
          error.response?.data?.error || "Failed to send transaction",
      });
    },
  });

  const handleSend = () => {
    if (!recipient || !amount) {
      toast.error("Missing Fields", {
        description: "Please enter recipient address and amount",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid amount",
      });
      return;
    }

    Alert.alert(
      "Confirm Transaction",
      `Send ${amount} ${selectedToken} to ${recipient.slice(0, 8)}...?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () =>
            sendMutation.mutate({
              recipient,
              amount: amountNum,
              token: selectedToken,
            }),
        },
      ],
    );
  };

  const handleScan = (data: string) => {
    setRecipient(data);
    setShowScanner(false);
    toast.success("Address Scanned", {
      description: "Wallet address has been filled",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* QR Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      </Modal>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-6">
          {/* Header */}
          <View className="mb-8 flex-row items-center gap-4">
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color="#111827" />
            </Pressable>
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Send Crypto
              </Text>
              <Text className="text-sm text-gray-600">
                Transfer tokens to another wallet
              </Text>
            </View>
          </View>

          {/* Balance Card */}
          <View className="mb-6 rounded-xl bg-blue-50 p-4">
            <Text className="text-sm text-gray-600">Available Balance</Text>
            <Text className="mt-1 text-2xl font-bold text-gray-900">
              {walletData?.solBalance?.toFixed(4) || "0.0000"} SOL
            </Text>
            <Text className="text-sm text-gray-600">
              ≈ ${walletData?.totalUSD?.toFixed(2) || "0.00"}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-5">
            {/* Recipient */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">
                Recipient Address
              </Text>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Input
                    placeholder="Enter wallet address"
                    value={recipient}
                    onChangeText={setRecipient}
                    autoCapitalize="none"
                    editable={!sendMutation.isPending}
                  />
                </View>
                <Pressable
                  onPress={() => setShowScanner(true)}
                  className="h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-200 bg-white active:bg-gray-50"
                >
                  <Scan size={24} color="#374151" />
                </Pressable>
              </View>
            </View>

            {/* Amount */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">Amount</Text>
              <Input
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!sendMutation.isPending}
              />
              <Pressable
                onPress={() =>
                  setAmount(walletData?.solBalance?.toString() || "0")
                }
              >
                <Text className="text-sm font-medium text-blue-600">
                  Use Max
                </Text>
              </Pressable>
            </View>

            {/* Token Selection */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">Token</Text>
              <View className="flex-row gap-2">
                <TokenButton
                  label="SOL"
                  selected={selectedToken === "SOL"}
                  onPress={() => setSelectedToken("SOL")}
                />
                <TokenButton
                  label="USDC"
                  selected={selectedToken === "USDC"}
                  onPress={() => setSelectedToken("USDC")}
                />
                <TokenButton
                  label="SKR"
                  selected={selectedToken === "SKR"}
                  onPress={() => setSelectedToken("SKR")}
                />
              </View>
            </View>

            {/* Transaction Fee */}
            <View className="rounded-lg bg-gray-50 p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">Network Fee</Text>
                <Text className="text-sm font-medium text-gray-900">
                  ~0.000005 SOL
                </Text>
              </View>
            </View>

            {/* Send Button */}
            <Button
              onPress={handleSend}
              disabled={sendMutation.isPending}
              className="mt-4 bg-blue-600 active:bg-blue-700"
            >
              <View className="flex-row items-center gap-2">
                <Send size={20} color="#ffffff" variant="Bold" />
                <Text className="text-base font-semibold text-white">
                  {sendMutation.isPending ? "Sending..." : "Send Transaction"}
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TokenButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-lg border-2 py-3 ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 bg-white active:bg-gray-50"
      }`}
    >
      <Text
        className={`font-semibold ${
          selected ? "text-blue-600" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
