import { sendPushNotification } from "@/config/notificationConfig";
import { Button, Text, View } from "react-native";

export const TestComponent = ({
  expoPushToken,
  notification,
}: {
  expoPushToken: any;
  notification: any;
}) => {
  console.log("Expo push token is", expoPushToken);
  console.log("Notificatmion is", notification);
  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
};
