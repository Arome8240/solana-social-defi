import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { walletAPI } from "@/lib/api";
import {
  ArrowLeft,
  Send,
  ReceiveSquare,
  Convert,
  TrendUp,
} from "iconsax-react-nativejs";

export default function TransactionsScreen() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions-all"],
    queryFn: () => walletAPI.getTransactions(50),
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
                Transaction History
              </Text>
              <Text className="text-sm text-gray-600">
                All your wallet activity
              </Text>
            </View>
          </View>

          {/* Transactions List */}
          {isLoading ? (
            <View className="items-center py-12">
              <Text className="text-gray-500">Loading transactions...</Text>
            </View>
          ) : transactions && transactions.length > 0 ? (
            <View className="gap-2 pb-6">
              {transactions.map((tx: any) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </View>
          ) : (
            <View className="items-center py-12">
              <Text className="text-center text-gray-500">
                No transactions yet
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-400">
                Your transaction history will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionCard({ transaction }: { transaction: any }) {
  const getIcon = () => {
    switch (transaction.type) {
      case "send":
        return <Send size={20} color="#ef4444" variant="Bold" />;
      case "receive":
        return <ReceiveSquare size={20} color="#10b981" variant="Bold" />;
      case "swap":
        return <Convert size={20} color="#8b5cf6" variant="Bold" />;
      case "stake":
        return <TrendUp size={20} color="#f59e0b" variant="Bold" />;
      default:
        return <Send size={20} color="#6b7280" variant="Bold" />;
    }
  };

  const getColor = () => {
    switch (transaction.type) {
      case "send":
        return "bg-red-50";
      case "receive":
        return "bg-green-50";
      case "swap":
        return "bg-purple-50";
      case "stake":
        return "bg-amber-50";
      default:
        return "bg-gray-50";
    }
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case "send":
        return "text-red-600";
      case "receive":
        return "text-green-600";
      default:
        return "text-gray-900";
    }
  };

  const getLabel = () => {
    switch (transaction.type) {
      case "send":
        return "Sent";
      case "receive":
        return "Received";
      case "swap":
        return "Swapped";
      case "stake":
        return "Staked";
      default:
        return transaction.type;
    }
  };

  return (
    <Pressable className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4 active:bg-gray-100">
      <View className="flex-row items-center gap-3">
        <View
          className={`h-12 w-12 items-center justify-center rounded-full ${getColor()}`}
        >
          {getIcon()}
        </View>
        <View>
          <Text className="font-semibold text-gray-900">{getLabel()}</Text>
          <Text className="text-xs text-gray-500">
            {new Date(transaction.timestamp).toLocaleString()}
          </Text>
          {transaction.status && (
            <Text
              className={`text-xs font-medium ${
                transaction.status === "confirmed"
                  ? "text-green-600"
                  : transaction.status === "pending"
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {transaction.status}
            </Text>
          )}
        </View>
      </View>
      <View className="items-end">
        <Text className={`font-semibold ${getAmountColor()}`}>
          {transaction.type === "send"
            ? "-"
            : transaction.type === "receive"
              ? "+"
              : ""}
          {transaction.amount.toFixed(4)} {transaction.token}
        </Text>
        <Text className="text-xs text-gray-500">
          ${transaction.usdValue.toFixed(2)}
        </Text>
        {transaction.fee && (
          <Text className="text-xs text-gray-400">
            Fee: {transaction.fee.toFixed(6)} SOL
          </Text>
        )}
      </View>
    </Pressable>
  );
}
