import * as React from "react";
import { Text, ITextProps } from "native-base";

export const TitleText = (props: ITextProps) => (
  <Text fontSize="xl" {...props}>
    {props.children}
  </Text>
);

export const ParagraphText = (props: ITextProps) => (
  <Text fontSize="md" {...props}>
    {props.children}
  </Text>
);

export const LabelText = (props: ITextProps) => (
  <Text fontSize="sm" {...props}>
    {props.children}
  </Text>
);

export const HelperText = (props: ITextProps) => (
  <Text fontSize="sm" color="coolGray.400" {...props}>
    {props.children}
  </Text>
);
