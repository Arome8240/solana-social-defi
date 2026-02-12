import { View, ScrollView, Pressable, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { stakingAPI, walletAPI } from "@/lib/api";
import {
  ArrowLeft,
  TrendUp,
  Award,
  Clock,
  Wallet,
} from "iconsax-react-nativejs";

export default function StakeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [isStaking, setIsStaking] = useState(true);

  const { data: pool, isLoading } = useQuery({
    queryKey: ["staking-pool", id],
    queryFn: async () => {
      const pools = await stakingAPI.getStakingPools();
      return pools.find((p: any) => p.id === id);
    },
  });

  const { data: walletData } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: walletAPI.getBalance,
  });

  const stakeMutation = useMutation({
    mutationFn: stakingAPI.stake,
    onSuccess: () => {
      toast.success("Staking Successful!", {
        description: `Staked ${amount} ${pool?.token}`,
      });
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["staking-pool", id] });
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
    },
    onError: (error: any) => {
      toast.error("Staking Failed", {
        description: error.response?.data?.error || "Failed to stake tokens",
      });
    },
  });

  const unstakeMutation = useMutation({
    mutationFn: stakingAPI.unstake,
    onSuccess: () => {
      toast.success("Unstaking Successful!", {
        description: `Unstaked ${amount} ${pool?.token}`,
      });
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["staking-pool", id] });
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
    },
    onError: (error: any) => {
      toast.error("Unstaking Failed", {
        description: error.response?.data?.error || "Failed to unstake tokens",
      });
    },
  });

  const claimMutation = useMutation({
    mutationFn: () => stakingAPI.claimRewards(id as string),
    onSuccess: (data) => {
      toast.success("Rewards Claimed!", {
        description: `Claimed ${data.amount} ${pool?.token}`,
      });
      queryClient.invalidateQueries({ queryKey: ["staking-pool", id] });
    },
    onError: (error: any) => {
      toast.error("Claim Failed", {
        description: error.response?.data?.error || "Failed to claim rewards",
      });
    },
  });

  const handleAction = () => {
    if (!amount) {
      toast.error("Missing Amount", {
        description: "Please enter an amount",
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

    const action = isStaking ? "stake" : "unstake";
    Alert.alert(
      `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      `${action.charAt(0).toUpperCase() + action.slice(1)} ${amount} ${pool?.token}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            if (isStaking) {
              stakeMutation.mutate({ poolId: id as string, amount: amountNum });
            } else {
              unstakeMutation.mutate({
                poolId: id as string,
                amount: amountNum,
              });
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading pool details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pool) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Pool not found</Text>
          <Button onPress={() => router.back()} className="mt-4">
            <Text className="text-white">Go Back</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

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
                {pool.name}
              </Text>
              <Text className="text-sm text-gray-600">
                {pool.token} Staking
              </Text>
            </View>
          </View>

          {/* Pool Stats */}
          <View className="mb-6 overflow-hidden rounded-2xl">
            <LinearGradient
              colors={["#2563eb", "#1d4ed8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className="mb-4 flex-row items-center gap-2">
                <TrendUp size={28} color="#ffffff" variant="Bold" />
                <Text className="text-xl font-semibold text-white">
                  Annual Percentage Yield
                </Text>
              </View>
              <Text className="text-5xl font-bold text-white">{pool.apy}%</Text>
              <Text className="mt-1 text-sm text-blue-100">
                Earn rewards by staking your tokens
              </Text>
            </LinearGradient>
          </View>

          {/* Your Stake */}
          {pool.userStaked > 0 && (
            <View className="mb-6 rounded-xl bg-green-50 p-5">
              <View className="mb-3 flex-row items-center gap-2">
                <Wallet size={24} color="#10b981" variant="Bold" />
                <Text className="text-lg font-semibold text-green-900">
                  Your Stake
                </Text>
              </View>
              <Text className="mb-2 text-3xl font-bold text-green-900">
                {pool.userStaked.toFixed(4)} {pool.token}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-green-700">
                  Pending Rewards: {pool.pendingRewards.toFixed(4)} {pool.token}
                </Text>
                {pool.pendingRewards > 0 && (
                  <Pressable
                    onPress={() => claimMutation.mutate()}
                    disabled={claimMutation.isPending}
                  >
                    <Text className="text-sm font-semibold text-green-600">
                      Claim
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}

          {/* Pool Info */}
          <View className="mb-6 gap-3">
            <InfoCard
              icon={<Award size={20} color="#6b7280" variant="Bold" />}
              label="Total Staked"
              value={`${pool.totalStaked.toLocaleString()} ${pool.token}`}
            />
            <InfoCard
              icon={<Clock size={20} color="#6b7280" variant="Bold" />}
              label="Lock Period"
              value={`${pool.lockPeriod} days`}
            />
            <InfoCard
              icon={<Wallet size={20} color="#6b7280" variant="Bold" />}
              label="Your Balance"
              value={`${walletData?.solBalance?.toFixed(4) || "0.0000"} ${pool.token}`}
            />
          </View>

          {/* Stake/Unstake Toggle */}
          <View className="mb-4 flex-row gap-2 rounded-lg bg-gray-100 p-1">
            <Pressable
              onPress={() => setIsStaking(true)}
              className={`flex-1 rounded-md py-2 ${
                isStaking ? "bg-white" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  isStaking ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Stake
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsStaking(false)}
              className={`flex-1 rounded-md py-2 ${
                !isStaking ? "bg-white" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  !isStaking ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Unstake
              </Text>
            </Pressable>
          </View>

          {/* Amount Input */}
          <View className="mb-4 gap-2">
            <Text className="text-sm font-medium text-gray-700">Amount</Text>
            <Input
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              editable={!stakeMutation.isPending && !unstakeMutation.isPending}
            />
            <Pressable
              onPress={() =>
                setAmount(
                  isStaking
                    ? walletData?.solBalance?.toString() || "0"
                    : pool.userStaked?.toString() || "0",
                )
              }
            >
              <Text className="text-sm font-medium text-blue-600">Use Max</Text>
            </Pressable>
          </View>

          {/* Action Button */}
          <Button
            onPress={handleAction}
            disabled={stakeMutation.isPending || unstakeMutation.isPending}
            className="mb-6 bg-blue-600 active:bg-blue-700"
          >
            <Text className="text-base font-semibold text-white">
              {stakeMutation.isPending || unstakeMutation.isPending
                ? "Processing..."
                : isStaking
                  ? "Stake Tokens"
                  : "Unstake Tokens"}
            </Text>
          </Button>

          {/* Info */}
          <View className="mb-6 rounded-lg bg-blue-50 p-4">
            <Text className="text-sm font-medium text-blue-900">
              ℹ️ Important Information
            </Text>
            <Text className="mt-2 text-sm text-blue-700">
              • Staked tokens are locked for {pool.lockPeriod} days{"\n"}•
              Rewards are calculated and distributed daily{"\n"}• Early
              unstaking may incur penalties{"\n"}• APY is subject to change
              based on pool performance
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-sm text-gray-600">{label}</Text>
      </View>
      <Text className="font-semibold text-gray-900">{value}</Text>
    </View>
  );
}
