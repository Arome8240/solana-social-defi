import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { stakingAPI } from "@/lib/api";
import { ArrowLeft, TrendUp, Award, Clock } from "iconsax-react-nativejs";

export default function StakeScreen() {
  const { data: pools, isLoading } = useQuery({
    queryKey: ["staking-pools"],
    queryFn: stakingAPI.getStakingPools,
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
                Staking Pools
              </Text>
              <Text className="text-sm text-gray-600">
                Earn rewards by staking your tokens
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View className="mb-6 rounded-xl bg-blue-50 p-4">
            <Text className="text-sm font-medium text-blue-900">
              💡 How Staking Works
            </Text>
            <Text className="mt-1 text-sm text-blue-700">
              Lock your tokens in a staking pool to earn passive rewards. The
              longer you stake, the more you earn!
            </Text>
          </View>

          {/* Staking Pools */}
          {isLoading ? (
            <View className="items-center py-12">
              <Text className="text-gray-500">Loading pools...</Text>
            </View>
          ) : pools && pools.length > 0 ? (
            <View className="gap-4 pb-6">
              {pools.map((pool: any) => (
                <StakingPoolCard key={pool.id} pool={pool} />
              ))}
            </View>
          ) : (
            <View className="items-center py-12">
              <Text className="text-gray-500">No staking pools available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StakingPoolCard({ pool }: { pool: any }) {
  return (
    <Pressable
      onPress={() => router.push(`/(app)/home/stake/${pool.id}`)}
      className="overflow-hidden rounded-xl bg-white shadow-sm active:bg-gray-50"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="p-5">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <TrendUp size={24} color="#3b82f6" variant="Bold" />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">
                {pool.name}
              </Text>
              <Text className="text-sm text-gray-600">{pool.token}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-bold text-green-600">
              {pool.apy}%
            </Text>
            <Text className="text-xs text-gray-500">APY</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="mb-4 flex-row gap-4">
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-1">
              <Award size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600">Total Staked</Text>
            </View>
            <Text className="font-semibold text-gray-900">
              {pool.totalStaked.toLocaleString()} {pool.token}
            </Text>
          </View>
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-1">
              <Clock size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600">Lock Period</Text>
            </View>
            <Text className="font-semibold text-gray-900">
              {pool.lockPeriod} days
            </Text>
          </View>
        </View>

        {/* Your Stake */}
        {pool.userStaked > 0 && (
          <View className="mb-4 rounded-lg bg-green-50 p-3">
            <Text className="text-xs text-green-700">Your Stake</Text>
            <Text className="mt-1 text-lg font-bold text-green-900">
              {pool.userStaked.toFixed(4)} {pool.token}
            </Text>
            <Text className="text-xs text-green-700">
              Rewards: {pool.pendingRewards.toFixed(4)} {pool.token}
            </Text>
          </View>
        )}

        {/* Action Button */}
        <Button
          onPress={() => router.push(`/(app)/home/stake/${pool.id}`)}
          className="bg-blue-600 active:bg-blue-700"
        >
          <Text className="text-base font-semibold text-white">
            {pool.userStaked > 0 ? "Manage Stake" : "Start Staking"}
          </Text>
        </Button>
      </View>
    </Pressable>
  );
}
