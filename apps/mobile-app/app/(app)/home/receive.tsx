import { View, Pressable, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Copy, Share as ShareIcon } from "iconsax-react-nativejs";

export default function ReceiveScreen() {
  const { user } = useAuth();

  const handleCopy = async () => {
    if (user?.walletAddress) {
      await Clipboard.setStringAsync(user.walletAddress);
      toast.success("Copied!", {
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleShare = async () => {
    if (user?.walletAddress) {
      try {
        await Share.share({
          message: `My Solana wallet address: ${user.walletAddress}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="mb-8 flex-row items-center gap-4">
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Receive Crypto
            </Text>
            <Text className="text-sm text-gray-600">
              Share your wallet address
            </Text>
          </View>
        </View>

        {/* QR Code */}
        <View className="mb-8 items-center">
          <View className="overflow-hidden rounded-2xl bg-white p-4 shadow-lg">
            <QRCodeGenerator
              value={user?.walletAddress || ""}
              size={256}
              backgroundColor="#ffffff"
              color="#000000"
            />
          </View>
        </View>

        {/* Wallet Address */}
        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-gray-700">
            Your Wallet Address
          </Text>
          <View className="rounded-xl bg-gray-50 p-4">
            <Text className="text-center text-sm text-gray-900">
              {user?.walletAddress}
            </Text>
          </View>
        </View>

        {/* Warning */}
        <View className="mb-6 rounded-lg bg-amber-50 p-4">
          <Text className="text-sm font-medium text-amber-900">
            ⚠️ Important
          </Text>
          <Text className="mt-1 text-sm text-amber-700">
            Only send Solana (SOL) and SPL tokens to this address. Sending other
            cryptocurrencies may result in permanent loss.
          </Text>
        </View>

        {/* Actions */}
        <View className="gap-3">
          <Button
            onPress={handleCopy}
            className="bg-blue-600 active:bg-blue-700"
          >
            <View className="flex-row items-center gap-2">
              <Copy size={20} color="#ffffff" variant="Bold" />
              <Text className="text-base font-semibold text-white">
                Copy Address
              </Text>
            </View>
          </Button>

          <Button onPress={handleShare} variant="outline">
            <View className="flex-row items-center gap-2">
              <ShareIcon size={20} color="#374151" variant="Bold" />
              <Text className="text-base font-semibold text-gray-900">
                Share Address
              </Text>
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
