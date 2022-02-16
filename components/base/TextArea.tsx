import * as React from "react";
import { TextArea as NBTextArea, IInputProps } from "native-base";

interface ITextAreaProps extends IInputProps {
  /**
   * Maps to react-native TextInput's numberOfLines.
   */
  totalLines?: number;
}
export const TextArea = (props: ITextAreaProps) => (
  <NBTextArea
    fontSize="md"
    color="coolGray.100"
    placeholderTextColor="coolGray.400"
    fontFamily="Karla_400Regular"
    {...props}
  />
);
