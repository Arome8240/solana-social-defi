import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = any;

export default function AnimatedTabButton(props: Props) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 120 });
    translateY.value = withTiming(2);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.1, {
      damping: 8,
      stiffness: 180,
    });

    translateY.value = withSpring(0);

    // settle back
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[props.style, animatedStyle]}
      android_ripple={{ color: "transparent" }}
    />
  );
}
