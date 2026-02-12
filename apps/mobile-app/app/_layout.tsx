import '../global.css';
import { Stack } from "expo-router";
import { Fragment } from "react";
import { PortalHost } from "@rn-primitives/portal";

export default function RootLayout() {
  return <Fragment>
    <Stack screenOptions={{ headerShown: false }} /><PortalHost />
  </Fragment>;
}
