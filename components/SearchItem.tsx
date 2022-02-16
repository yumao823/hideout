import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Pressable, Spacer, HStack, theme } from "native-base";
import { ParagraphText } from "./base/Texts";

export function SearchItem(props: {
  onPress: () => void;
  image?: string;
  name?: string;
}) {
  return (
    <Pressable onPress={props.onPress}>
      <HStack alignItems="center" justifyContent="center" mb="1">
        <Image alt="image" size={30} source={{ uri: props.image || "" }} />
        <ParagraphText ml={3}>{props.name || ""}</ParagraphText>
        <Spacer />
        <FontAwesome name="angle-right" size={20} color={theme.colors.white} />
      </HStack>
    </Pressable>
  );
}
