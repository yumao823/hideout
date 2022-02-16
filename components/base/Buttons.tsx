import * as React from "react";
import {
  Button,
  Flex,
  HStack,
  IButtonProps,
  Pressable,
  theme,
} from "native-base";
import { ParagraphText, LabelText } from "./Texts";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export const PrimaryButton = (props: IButtonProps) => (
  <Button
    size="lg"
    py="3"
    _loading={{
      _text: {
        color: "coolGray.700",
      },
    }}
    _spinner={{
      color: "coolGray.700",
    }}
    {...props}
    backgroundColor={props.isDisabled ? "coolGray.700" : "yellow.400"}
  >
    <ParagraphText
      color={props.isDisabled ? "coolGray.900" : "coolGray.700"}
      fontFamily="Karla_700Bold"
    >
      {props.children}
    </ParagraphText>
  </Button>
);

export const HiddenButton = (props: IButtonProps) => (
  <Button size="lg" py="3" {...props} bg="coolGray.700">
    <ParagraphText color="coolGray.500" fontFamily="Karla_700Bold">
      {props.children}
    </ParagraphText>
  </Button>
);

export const SecondaryButton = (props: IButtonProps) => (
  <Button size="lg" py="3" {...props} bg="coolGray.700">
    <ParagraphText color="yellow.400" fontFamily="Karla_700Bold">
      {props.children}
    </ParagraphText>
  </Button>
);

export const PlusButton = ({
  active,
  text,
  onPress,
}: {
  active: boolean;
  text: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <HStack
      bgColor={active ? theme.colors.yellow[400] : theme.colors.coolGray[800]}
      borderWidth={1}
      borderColor={
        active ? theme.colors.yellow[400] : theme.colors.coolGray[100]
      }
      borderRadius={20}
      mr="2"
      mb="4"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      py="1"
      px="3"
      height="10"
    >
      <ParagraphText
        mr="6"
        color={active ? theme.colors.coolGray[700] : theme.colors.coolGray[100]}
      >
        {text}
      </ParagraphText>
      <FontAwesome
        name={active ? "check" : "plus"}
        size={active ? 13 : 16}
        color={active ? theme.colors.coolGray[700] : theme.colors.coolGray[100]}
      />
    </HStack>
  </TouchableOpacity>
);

export const FeedBackButton = ({
  type,
  percent = 0,
  active,
  onPress,
}: {
  type: string;
  percent: number;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <Button
      borderRadius={30}
      backgroundColor={
        !active
          ? theme.colors.coolGray[800]
          : type === "like"
          ? "#196355"
          : "#72343C"
      }
      px={5}
      m={3}
    >
      <Flex display="flex" flexDirection="row" alignItems="center">
        <FontAwesome
          name={type === "like" ? "thumbs-o-up" : "thumbs-o-down"}
          color={type === "like" ? "#10B981" : "#EF4444"}
          size={20}
        />
        <LabelText
          ml={2}
          color={
            !active
              ? theme.colors.coolGray[800]
              : type === "like"
              ? "#10B981"
              : "#EF4444"
          }
        >
          {percent}%
        </LabelText>
      </Flex>
    </Button>
  </TouchableOpacity>
);

export const CancelButton = (props: IButtonProps) => (
  <Button bgColor={theme.colors.coolGray[800]} py={1} onPress={props.onPress}>
    {props.children}
  </Button>
);
