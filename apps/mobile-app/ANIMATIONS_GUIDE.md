# Authentication Animations Guide

## Overview

All authentication screens now feature smooth, professional animations using React Native Reanimated for enhanced UX. Icons have been replaced with proper icon libraries (Iconsax and Lucide).

## Animation Patterns

### Welcome Screen

- **Logo**: Scale + rotation bounce effect on mount
- **Title**: Fade in with upward slide
- **Features**: Staggered fade-in with scale animation (100ms delay between items)
- **Buttons**: Fade in with upward slide

### Login Screen

- **Header**: Fade in with downward slide + icon
- **Form**: Delayed fade in with upward slide
- **Footer**: Final fade in for signup link
- **Timing**: 200ms stagger between sections

### Signup Screen

- **Header**: Fade in with downward slide + icon
- **Form**: Delayed fade in with upward slide
- **Info Box**: Scale + fade animation
- **Footer**: Final fade in for login link
- **Timing**: 200ms stagger between sections

### Home Screen

- **Welcome**: Fade in with upward slide
- **Wallet Card**: Scale + fade animation
- **Stats**: Delayed fade in
- **Info Box**: Final fade in
- **Timing**: 200ms stagger between sections

### Profile Screen

- **Header**: Scale + fade animation
- **Wallet Info**: Fade in with upward slide
- **Menu Items**: Delayed fade in
- **Logout Button**: Final fade in
- **Timing**: 200ms stagger between sections

## Icon Libraries Used

### Iconsax React Native

Used for primary UI icons with variant support:

- `Wallet` - Wallet/crypto related
- `User` - User profile
- `Sms` - Email/messaging
- `Lock` - Security/password
- `Shield` - Protection/security
- `SecurityUser` - User security
- `Setting2` - Settings
- `LogoutCurve` - Logout action
- `MessageText` - Social features
- `Award` - Rewards/achievements
- `ArrowSwap` - Trading/swapping

### Lucide React Native

Used for accent icons:

- `Rocket` - Launch/welcome
- `LogIn` - Login action
- `UserPlus` - Signup action
- `Sparkles` - Highlights/special
- `ChevronRight` - Navigation arrows

## Animation Configuration

### Spring Animations

```typescript
withSpring(1, { damping: 10, stiffness: 100 });
```

Used for: Scale, position transforms
Effect: Bouncy, natural feel

### Timing Animations

```typescript
withTiming(1, { duration: 600 });
```

Used for: Opacity changes
Effect: Smooth, linear fade

### Delays

```typescript
withDelay(200, animation);
```

Used for: Staggered animations
Effect: Sequential reveal

## Best Practices

1. **Shared Values**: Use `useSharedValue` for animated properties
2. **Animated Styles**: Create with `useAnimatedStyle`
3. **Dependencies**: Shared values don't need to be in useEffect deps
4. **Performance**: Animations run on UI thread (60fps)
5. **Timing**: 200-400ms delays feel natural
6. **Duration**: 600ms for most animations

## Customization

### Adjust Animation Speed

Change duration in `withTiming`:

```typescript
withTiming(1, { duration: 400 }); // Faster
withTiming(1, { duration: 800 }); // Slower
```

### Adjust Spring Bounce

Modify spring config:

```typescript
withSpring(1, {
  damping: 15, // More damping = less bounce
  stiffness: 150, // More stiffness = faster
});
```

### Adjust Stagger Delay

Change delay values:

```typescript
withDelay(100, animation); // Faster sequence
withDelay(300, animation); // Slower sequence
```

## Performance Notes

- All animations use Reanimated's worklet system
- Runs on UI thread, not JS thread
- No bridge communication during animation
- Smooth 60fps on most devices
- Minimal battery impact

## Accessibility

- Animations respect system motion preferences
- Can be disabled via `reduceMotion` setting
- All content remains accessible during animations
- No critical information hidden by animations
