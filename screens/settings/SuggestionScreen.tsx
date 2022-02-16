import * as React from "react";
import { VStack, Spacer } from "native-base";
import { ScreenBox } from "../../components/ScreenBox";
import { ParagraphText, HelperText } from "../../components/base/Texts";
import { PrimaryButton } from "../../components/base/Buttons";
import { TextArea } from "../../components/base/TextArea";

export default function SuggestionScreen(props: any) {
  return (
    <ScreenBox>
      <VStack space={2} h="100%">
        <ParagraphText>{props.label}</ParagraphText>
        <TextArea numberOfLines={8} placeholder={props.placeholder} />
        <HelperText alignSelf="flex-start">{props.hint}</HelperText>
        <Spacer />
        <PrimaryButton mb="5">Send Request</PrimaryButton>
      </VStack>
    </ScreenBox>
  );
}
