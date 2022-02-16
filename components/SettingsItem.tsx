import * as React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { Pressable, Spacer, HStack, theme } from "native-base";
import { ParagraphText } from "./base/Texts";

export function SettingsItem(props: any) {
  const navigation = useNavigation();
  const path = props.path == "" ? "SettingsScreen" : props.path;
  return (
    <Pressable onPress={() => navigation.navigate(path)}>
      <HStack alignItems="flex-start" mb="7">
        <ParagraphText>{props.name}</ParagraphText>
        <Spacer />
        <FontAwesome name="angle-right" size={20} color={theme.colors.white} />
      </HStack>
    </Pressable>
  );
}
