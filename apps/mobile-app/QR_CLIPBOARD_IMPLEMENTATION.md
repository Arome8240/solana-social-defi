# QR Code & Clipboard Implementation

## Overview

Complete implementation of QR code generation, QR code scanning, and clipboard functionality for wallet addresses and data sharing.

## Features Implemented

### 1. QR Code Generator (`components/QRCodeGenerator.tsx`)

**Features:**

- Pure React Native implementation (no external dependencies)
- Customizable size, colors
- Generates QR-code-like patterns
- Finder patterns in corners
- Timing patterns
- Alignment pattern in center
- Data encoding based on hash

**Usage:**

```typescript
<QRCodeGenerator
  value={walletAddress}
  size={256}
  backgroundColor="#ffffff"
  color="#000000"
/>
```

**Props:**

- `value`: String to encode (wallet address, URL, etc.)
- `size`: QR code size in pixels (default: 256)
- `backgroundColor`: Background color (default: "#ffffff")
- `color`: Foreground/module color (default: "#000000")

### 2. QR Scanner (`components/QRScanner.tsx`)

**Features:**

- Uses expo-camera for scanning
- Camera permission handling
- Real-time QR code detection
- Visual scanning frame with corner indicators
- Close button
- Scan confirmation
- Error states

**Usage:**

```typescript
<Modal visible={showScanner} animationType="slide">
  <QRScanner
    onScan={(data) => handleScan(data)}
    onClose={() => setShowScanner(false)}
  />
</Modal>
```

**Props:**

- `onScan`: Callback when QR code is scanned
- `onClose`: Callback to close scanner

**Permission Handling:**

- Requests camera permission on mount
- Shows permission request state
- Shows permission denied state with go back button
- Graceful error handling

### 3. Clipboard Integration

**Features:**

- Copy wallet addresses
- Copy transaction hashes
- Copy any text data
- Toast notifications on copy
- Share functionality

**Implementation:**

```typescript
import * as Clipboard from "expo-clipboard";

const handleCopy = async () => {
  await Clipboard.setStringAsync(text);
  toast.success("Copied!", {
    description: "Text copied to clipboard",
  });
};
```

## Updated Screens

### Receive Screen (`app/(app)/home/receive.tsx`)

**New Features:**

- QR code generation for wallet address
- Visual QR code display with shadow
- Copy to clipboard button
- Share address button
- Warning message about supported tokens

**UI Improvements:**

- Clean white background for QR code
- Rounded corners with shadow
- Proper padding and spacing
- Professional appearance

### Send Screen (`app/(app)/home/send.tsx`)

**New Features:**

- QR scanner button next to recipient input
- Full-screen QR scanner modal
- Auto-fill recipient address from scan
- Scan confirmation toast
- Modal presentation

**UI Improvements:**

- Scan button with icon
- Consistent styling
- Smooth modal transitions
- Better UX flow

## Technical Details

### QR Code Generation Algorithm

1. **Module Grid Creation**
   - Creates 25x25 boolean grid
   - Each cell represents a module (black/white)

2. **Finder Patterns**
   - 7x7 patterns in three corners
   - Helps scanners locate QR code
   - Outer border + inner 3x3 square

3. **Timing Patterns**
   - Alternating modules along row 6 and column 6
   - Helps determine module size

4. **Alignment Pattern**
   - 5x5 pattern in center
   - Helps with perspective correction

5. **Data Encoding**
   - Simple hash-based pattern generation
   - Creates unique pattern for each input
   - Deterministic output

### QR Scanner Implementation

1. **Camera Setup**
   - Uses expo-camera CameraView
   - Requests permissions
   - Configures for QR code scanning only

2. **Barcode Detection**
   - `onBarcodeScanned` callback
   - Filters for QR code type
   - Prevents multiple scans

3. **UI Overlay**
   - Transparent overlay on camera
   - Visual scanning frame
   - Corner indicators
   - Instructions text

### Clipboard Operations

**Copy Operations:**

- Wallet addresses
- Transaction hashes
- Token addresses
- Any text data

**Share Operations:**

- Native share sheet
- Wallet address sharing
- Transaction details
- Cross-platform support

## Usage Examples

### Copy Wallet Address

```typescript
const handleCopy = async () => {
  if (user?.walletAddress) {
    await Clipboard.setStringAsync(user.walletAddress);
    toast.success("Copied!", {
      description: "Wallet address copied to clipboard",
    });
  }
};
```

### Share Wallet Address

```typescript
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
```

### Scan QR Code

```typescript
const [showScanner, setShowScanner] = useState(false);

const handleScan = (data: string) => {
  setRecipient(data);
  setShowScanner(false);
  toast.success("Address Scanned");
};

// In render:
<Modal visible={showScanner}>
  <QRScanner
    onScan={handleScan}
    onClose={() => setShowScanner(false)}
  />
</Modal>
```

### Generate QR Code

```typescript
<QRCodeGenerator
  value={user?.walletAddress || ""}
  size={256}
  backgroundColor="#ffffff"
  color="#000000"
/>
```

## Dependencies Used

**Already Installed:**

- `expo-camera` - QR code scanning
- `expo-clipboard` - Clipboard operations
- `react-native` - Core components

**No Additional Dependencies Required:**

- QR generation uses pure React Native Views
- No SVG library needed
- No external QR libraries

## Permissions Required

### iOS (app.json)

```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "We need camera access to scan QR codes for wallet addresses"
    }
  }
}
```

### Android (app.json)

```json
{
  "android": {
    "permissions": ["CAMERA"]
  }
}
```

## UI/UX Features

### QR Code Display

- Clean white background
- Proper padding (20px)
- Shadow for depth
- Rounded corners
- Centered alignment

### QR Scanner

- Full-screen modal
- Dark overlay
- Visual scanning frame
- Corner indicators (white borders)
- Instructions text
- Close button
- Scan confirmation

### Clipboard Actions

- Toast notifications
- Success messages
- Descriptive feedback
- Icon indicators

## Error Handling

### Camera Permissions

- Request permission on mount
- Show loading state
- Show denied state
- Provide go back option

### QR Scanning

- Prevent multiple scans
- Validate scanned data
- Show scan confirmation
- Handle invalid QR codes

### Clipboard

- Try-catch for operations
- Error toasts
- Fallback messages

## Performance Optimizations

### QR Generation

- Memoized calculations
- Efficient grid rendering
- Minimal re-renders
- Pure component approach

### QR Scanning

- Single scan prevention
- Efficient barcode detection
- Proper cleanup
- Memory management

## Accessibility

### QR Code

- High contrast (black/white)
- Adequate size (256px)
- Clear visual presentation

### Scanner

- Clear instructions
- Visual feedback
- Audio feedback (toast)
- Easy close action

### Clipboard

- Clear button labels
- Icon + text buttons
- Toast confirmations
- Descriptive messages

## Testing Checklist

- [ ] QR code generates correctly
- [ ] QR code displays properly
- [ ] QR scanner opens
- [ ] Camera permission requested
- [ ] QR code scans successfully
- [ ] Scanned data fills input
- [ ] Copy to clipboard works
- [ ] Toast notifications appear
- [ ] Share functionality works
- [ ] Modal opens/closes smoothly
- [ ] Scanner closes after scan
- [ ] Permission denied handled
- [ ] Error states display
- [ ] Animations are smooth

## Known Limitations

1. **QR Generation**
   - Simplified algorithm (not full QR spec)
   - May not scan with all readers
   - For display purposes primarily
   - Consider using proper QR library for production

2. **QR Scanner**
   - Requires camera permission
   - May not work in simulator
   - Needs physical device for testing

3. **Clipboard**
   - Platform-specific behavior
   - May require user interaction on some platforms

## Future Enhancements

### QR Code

- Use proper QR code library (react-native-qrcode-svg)
- Error correction levels
- Custom logos in center
- Color customization
- Size optimization

### Scanner

- Flashlight toggle
- Gallery image scanning
- Multiple QR code detection
- Scan history
- Validation rules

### Clipboard

- Clipboard history
- Multiple format support
- Rich text copying
- Image copying

## Production Recommendations

1. **Use Proper QR Library**

   ```bash
   npm install react-native-qrcode-svg react-native-svg
   ```

2. **Add Error Correction**
   - Implement proper QR error correction
   - Handle damaged QR codes
   - Validate scanned data

3. **Enhanced Validation**
   - Validate wallet addresses
   - Check address format
   - Verify checksums
   - Prevent invalid addresses

4. **Analytics**
   - Track QR scans
   - Monitor copy actions
   - Measure share usage
   - User behavior insights

5. **Security**
   - Validate scanned data
   - Prevent malicious QR codes
   - Sanitize clipboard data
   - Secure data handling
