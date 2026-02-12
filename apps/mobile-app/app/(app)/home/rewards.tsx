import { View, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { rewardsAPI } from "@/lib/api";
import {
  ArrowLeft,
  Award,
  Gift,
  Calendar,
  Star1,
} from "iconsax-react-nativejs";

export default function RewardsScreen() {
  const queryClient = useQueryClient();

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: rewardsAPI.getRewards,
  });

  const claimDailyMutation = useMutation({
    mutationFn: rewardsAPI.claimDailyReward,
    onSuccess: (data) => {
      toast.success("Reward Claimed!", {
        description: `You received ${data.amount} SKR tokens`,
      });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
    onError: (error: any) => {
      toast.error("Claim Failed", {
        description: error.response?.data?.error || "Failed to claim reward",
      });
    },
  });

  const handleClaimDaily = () => {
    Alert.alert("Claim Daily Reward", "Claim your daily SKR token reward?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Claim",
        onPress: () => claimDailyMutation.mutate(),
      },
    ]);
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
                Rewards Center
              </Text>
              <Text className="text-sm text-gray-600">
                Earn and claim your rewards
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View className="items-center py-12">
              <Text className="text-gray-500">Loading rewards...</Text>
            </View>
          ) : (
            <>
              {/* Total Rewards Card */}
              <View className="mb-6 overflow-hidden rounded-2xl">
                <LinearGradient
                  colors={["#f59e0b", "#ea580c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-6"
                >
                  <View className="mb-4 flex-row items-center gap-2">
                    <Award size={28} color="#ffffff" variant="Bold" />
                    <Text className="text-xl font-semibold text-white">
                      Total Earned
                    </Text>
                  </View>
                  <Text className="text-5xl font-bold text-white">
                    {rewards?.totalEarned?.toFixed(2) || "0.00"}
                  </Text>
                  <Text className="mt-1 text-lg text-amber-100">
                    SKR Tokens
                  </Text>
                </LinearGradient>
              </View>

              {/* Available to Claim */}
              {rewards?.availableToClaim > 0 && (
                <View className="mb-6 rounded-xl bg-green-50 p-5">
                  <View className="mb-3 flex-row items-center gap-2">
                    <Gift size={24} color="#10b981" variant="Bold" />
                    <Text className="text-lg font-semibold text-green-900">
                      Available to Claim
                    </Text>
                  </View>
                  <Text className="mb-4 text-3xl font-bold text-green-900">
                    {rewards.availableToClaim.toFixed(2)} SKR
                  </Text>
                  <Button
                    onPress={handleClaimDaily}
                    disabled={claimDailyMutation.isPending}
                    className="bg-green-600 active:bg-green-700"
                  >
                    <Text className="text-base font-semibold text-white">
                      {claimDailyMutation.isPending
                        ? "Claiming..."
                        : "Claim Now"}
                    </Text>
                  </Button>
                </View>
              )}

              {/* Daily Reward */}
              <View className="mb-6">
                <Text className="mb-3 text-lg font-semibold text-gray-900">
                  Daily Rewards
                </Text>
                <View className="rounded-xl bg-blue-50 p-5">
                  <View className="mb-3 flex-row items-center gap-2">
                    <Calendar size={24} color="#3b82f6" variant="Bold" />
                    <Text className="text-base font-semibold text-blue-900">
                      Daily Check-in
                    </Text>
                  </View>
                  <Text className="mb-2 text-sm text-blue-700">
                    Streak: {rewards?.dailyStreak || 0} days
                  </Text>
                  <Text className="text-sm text-blue-700">
                    {rewards?.canClaimDaily
                      ? "✓ Ready to claim today's reward!"
                      : "Come back tomorrow for your next reward"}
                  </Text>
                </View>
              </View>

              {/* Reward History */}
              <View className="mb-6">
                <Text className="mb-3 text-lg font-semibold text-gray-900">
                  Earning Activities
                </Text>
                <View className="gap-2">
                  <ActivityCard
                    icon={<Star1 size={20} color="#f59e0b" variant="Bold" />}
                    title="Post Engagement"
                    amount={rewards?.fromPosts || 0}
                    description="Earned from likes and comments"
                  />
                  <ActivityCard
                    icon={<Award size={20} color="#8b5cf6" variant="Bold" />}
                    title="Content Creation"
                    amount={rewards?.fromContent || 0}
                    description="Earned from creating posts"
                  />
                  <ActivityCard
                    icon={<Calendar size={20} color="#3b82f6" variant="Bold" />}
                    title="Daily Check-ins"
                    amount={rewards?.fromDaily || 0}
                    description="Earned from daily rewards"
                  />
                </View>
              </View>

              {/* Info */}
              <View className="mb-6 rounded-lg bg-amber-50 p-4">
                <Text className="text-sm font-medium text-amber-900">
                  💡 How to Earn More
                </Text>
                <Text className="mt-2 text-sm text-amber-700">
                  • Check in daily for streak bonuses{"\n"}• Create engaging
                  content{"\n"}• Interact with other users{"\n"}• Complete
                  special challenges
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityCard({
  icon,
  title,
  amount,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  amount: number;
  description: string;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-900">{title}</Text>
          <Text className="text-xs text-gray-500">{description}</Text>
        </View>
      </View>
      <Text className="text-lg font-bold text-amber-600">
        {amount.toFixed(2)}
      </Text>
    </View>
  );
}
