import React from "react";
import { Flex, HStack, theme } from "native-base";
import { HelperText, ParagraphText } from "./Texts";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const Rating = ({
  size = 20,
  rating = 5,
  touchable = false,
  title = "",
  onRatingChange,
  hasErrors = false,
  errorText,
}: {
  size: number;
  touchable: boolean;
  rating: number;
  title: string;
  onRatingChange: (e: number) => void;
  hasErrors: boolean;
  errorText?: string;
}) => {
  return (
    <Flex alignItems="center" mb={2}>
      <ParagraphText mb={1}>{title}</ParagraphText>
      <HStack alignItems="center" mb={2} space="2">
        {Array.from(Array(5).keys()).map((i) => (
          <TouchableOpacity
            onPress={() => {
              if (touchable) {
                onRatingChange(i + 1);
              }
            }}
          >
            <FontAwesome
              key={i}
              name="star"
              color={
                i + 1 > rating
                  ? theme.colors.coolGray[700]
                  : theme.colors.yellow[400]
              }
              size={size}
            />
          </TouchableOpacity>
        ))}
      </HStack>
      {hasErrors && (
        <HelperText mt="1" color="red.400">
          {errorText}
        </HelperText>
      )}
    </Flex>
  );
};

export default Rating;
