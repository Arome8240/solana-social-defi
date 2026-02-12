import { View } from "react-native";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
}

export function QRCodeGenerator({
  value,
  size = 256,
  backgroundColor = "#ffffff",
  color = "#000000",
}: QRCodeGeneratorProps) {
  // Generate QR code modules
  const modules = generateQRCode(value);
  const moduleSize = (size - 40) / modules.length; // 40px padding

  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: size - 40,
          height: size - 40,
          flexDirection: "column",
        }}
      >
        {modules.map((row, y) => (
          <View
            key={y}
            style={{
              flexDirection: "row",
              height: moduleSize,
            }}
          >
            {row.map((cell, x) => (
              <View
                key={`${x}-${y}`}
                style={{
                  width: moduleSize,
                  height: moduleSize,
                  backgroundColor: cell ? color : backgroundColor,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// Simple QR code generation (basic implementation)
// This creates a QR-code-like pattern for demonstration
// For production, consider using expo-barcode-generator or similar
function generateQRCode(data: string): boolean[][] {
  const size = 25; // QR code size
  const modules: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  // Add finder patterns (corners)
  addFinderPattern(modules, 0, 0);
  addFinderPattern(modules, size - 7, 0);
  addFinderPattern(modules, 0, size - 7);

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    modules[6][i] = i % 2 === 0;
    modules[i][6] = i % 2 === 0;
  }

  // Add alignment pattern (center)
  const center = Math.floor(size / 2);
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const y = center + r;
      const x = center + c;
      if (y >= 0 && y < size && x >= 0 && x < size) {
        const isEdge = Math.abs(r) === 2 || Math.abs(c) === 2;
        const isCenter = r === 0 && c === 0;
        modules[y][x] = isEdge || isCenter;
      }
    }
  }

  // Add data pattern (simplified - creates a unique pattern based on data)
  const hash = simpleHash(data);
  for (let y = 9; y < size - 9; y++) {
    for (let x = 9; x < size - 9; x++) {
      // Skip alignment pattern area
      if (Math.abs(y - center) > 3 || Math.abs(x - center) > 3) {
        modules[y][x] = ((hash >> ((y * size + x) % 32)) & 1) === 1;
      }
    }
  }

  return modules;
}

function addFinderPattern(modules: boolean[][], row: number, col: number) {
  // 7x7 finder pattern
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const y = row + r;
      const x = col + c;
      if (y >= 0 && y < modules.length && x >= 0 && x < modules[0].length) {
        // Outer border (7x7)
        const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
        // Inner square (3x3 centered)
        const isInnerSquare = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        modules[y][x] = isOuterBorder || isInnerSquare;
      }
    }
  }
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
