import { Heading } from "native-base";
import * as React from "react";
import { NotificationItem } from "../../components/NotificationItem";
import { ScreenBox } from "../../components/ScreenBox";

export default function PushNotificationsSettingsScreen() {
  return (
    <ScreenBox>
      <NotificationItem name="Enable Push Notifications" status={true} />
      <Heading fontSize={18} mb="5">
        Account
      </Heading>
      <NotificationItem name="Enable Push Notifications" status={true} />
      <NotificationItem name="Enable Push Notifications" status={true} />
      <NotificationItem name="Enable Push Notifications" status={true} />
      <NotificationItem name="Enable Push Notifications" status={false} />
    </ScreenBox>
  );
}
