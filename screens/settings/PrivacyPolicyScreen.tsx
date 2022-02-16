import * as React from "react";
import { VStack } from "native-base";
import { ScreenBox } from "../../components/ScreenBox";
import { ParagraphText } from "../../components/base/Texts";

export default function PrivacyPolicyScreen() {
  return (
    <ScreenBox>
      <VStack space={2} h="100%">
        <ParagraphText>Privacy Policy</ParagraphText>
      </VStack>
    </ScreenBox>
  );
}