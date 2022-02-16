import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Box, Flex, theme } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { ScreenBox } from "../components/ScreenBox";
import { HelperText, ParagraphText } from "../components/base/Texts";

const NOTIFICATIONS = [
  {
    id: 0,
    name: "Tech",
    description: "Is this really what working as a startup is like?",
    date: "yesterday",
  },
  {
    id: 1,
    name: "Tech",
    description:
      "I was in denial, Maybe still I am but I understand why Amazon gets the hate.",
    date: "yesterday",
  },
  {
    id: 2,
    name: "Tech",
    description: "Is this really what working as a startup is like?",
    date: "yesterday",
  },
  {
    id: 3,
    name: "Tech",
    description:
      "I was in denial, Maybe still I am but I understand why Amazon gets the hate.",
    date: "yesterday",
  },
];

export default function NotificationsScreen() {
  return (
    <ScreenBox scrollable>
      {NOTIFICATIONS.map((item) => (
        <Item key={item.id} notification={item} />
      ))}
    </ScreenBox>
  );
}

function Item(props: any) {
  return (
    <TouchableOpacity>
      <Flex flexDirection="row" mb={8}>
        <Box mt="1.5">
          <FontAwesome name="bell" size={16} color={theme.colors.yellow[400]} />
        </Box>
        <Box ml={4}>
          <HelperText>{props.notification.name}</HelperText>
          <ParagraphText>{props.notification.description}</ParagraphText>
          <Flex flexDirection="row">
            <HelperText mr={2}>Topics</HelperText>
            <HelperText>{props.notification.date}</HelperText>
          </Flex>
        </Box>
      </Flex>
    </TouchableOpacity>
  );
}
