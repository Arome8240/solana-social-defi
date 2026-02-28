import { useEffect } from "react";
import { router } from "expo-router";

export default function SignupScreen() {
  useEffect(() => {
    // Redirect to new signup flow
    router.replace("/(auth)/signup-step1");
  }, []);

  return null;
}
