import { View, StyleSheet, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { CloseCircle } from "iconsax-react-nativejs";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      onScan(data);
    }
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-6 mt-3">
        <Text className="mb-4 text-center text-white">
          Camera permission is required to scan QR codes
        </Text>
        <Button onPress={onClose} variant="outline">
          <Text className="text-white">Go Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Overlay */}
      <View className="flex-1">
        {/* Top bar */}
        <View className="flex-row items-center justify-between p-6">
          <Text className="text-lg font-semibold text-white">Scan QR Code</Text>
          <Pressable onPress={onClose}>
            <CloseCircle size={32} color="#ffffff" variant="Bold" />
          </Pressable>
        </View>

        {/* Scanning frame */}
        <View className="flex-1 items-center justify-center">
          <View className="relative h-64 w-64">
            {/* Corner borders */}
            <View className="absolute left-0 top-0 h-12 w-12 border-l-4 border-t-4 border-white" />
            <View className="absolute right-0 top-0 h-12 w-12 border-r-4 border-t-4 border-white" />
            <View className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-white" />
            <View className="absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 border-white" />
          </View>
        </View>

        {/* Instructions */}
        <View className="items-center p-6">
          <Text className="text-center text-white">
            Position the QR code within the frame
          </Text>
          {scanned && (
            <Text className="mt-2 text-center text-green-400">
              QR Code Scanned!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
