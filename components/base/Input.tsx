import React, { Ref, useEffect, useRef, useState } from "react";
import {
  Box,
  Icon,
  Input as NBInput,
  IInputProps,
  Flex,
  theme,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { CancelButton } from "./Buttons";
import { LabelText, HelperText } from "./Texts";
import { TextArea } from "./TextArea";
import { TextInput, TouchableOpacity } from "react-native";

export const Input = (props: IInputProps) => (
  <NBInput
    fontSize="md"
    color="coolGray.100"
    placeholderTextColor="coolGray.400"
    fontFamily="Karla_400Regular"
    py="2"
    {...props}
  />
);

export const ChatInput = React.forwardRef(
  (
    {
      text,
      onChangeText,
      placeholder,
      onPost,
      onLoseFocus,
    }: {
      placeholder: string;
      text: string;
      onChangeText: (text: string) => void;
      onPost: () => void;
      onLoseFocus: () => void;
    },
    ref
  ) => (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px="2"
    >
      <TextInput
        value={text}
        placeholder={placeholder}
        style={{
          backgroundColor: theme.colors.coolGray[700],
          width: text == "" ? "100%" : "88%",
          borderRadius: "100%",
          padding: 8,
          paddingHorizontal: 15,
          color: theme.colors.white,
        }}
        placeholderTextColor={theme.colors.coolGray[400]}
        onChangeText={onChangeText}
        onBlur={onLoseFocus}
        ref={ref}
      />
      <TouchableOpacity onPress={onPost} style={{}}>
        {text !== "" && (
          <LabelText color={theme.colors.yellow[400]}>Post</LabelText>
        )}
      </TouchableOpacity>
    </Flex>
  )
);

export const SearchInput = (props: any) => {
  const [search, setSearch] = useState<String>(props.value);

  useEffect(() => {
    setSearch(props.value);
  }, [props]);

  return (
    <Flex direction="row" alignItems="center" justifyContent="space-between">
      <Input
        value={search}
        placeholder={props.placeholder}
        width={search == "" ? "100%" : "80%"}
        {...props}
        InputLeftElement={
          <Icon
            ml={3}
            size={4}
            color={theme.colors.coolGray[400]}
            as={<FontAwesome name="search" />}
          />
        }
        onChangeText={props.onChangeText}
        onEndEditing={props.onEndEditing}
      />
      {search !== "" && (
        <CancelButton onPress={props.onCancel}>Cancel</CancelButton>
      )}
    </Flex>
  );
};

export const InputGroup = ({
  label,
  value,
  placeholder,
  help,
  textarea = false,
  keyboardType = "text",
  onChange,
  hasErrors = false,
  errorText,
}: {
  label: string;
  value: string | number;
  placeholder: string;
  help: string;
  textarea?: boolean;
  keyboardType?: string;
  onChange: (e: string) => void;
  hasErrors: boolean;
  errorText?: string;
}) => (
  <Box>
    <LabelText>{label}</LabelText>
    {textarea ? (
      <TextArea
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
      />
    ) : (
      <Input
        value={value}
        keyboardType={keyboardType}
        placeholder={placeholder}
        onChangeText={(e) => onChange(e)}
      />
    )}
    <HelperText>{help}</HelperText>
    {hasErrors && (
      <HelperText mt="1" color="red.400">
        {errorText}
      </HelperText>
    )}
  </Box>
);
