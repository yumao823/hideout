import { Box, ScrollView, theme, View } from "native-base";
import React from "react";

interface ScreenBoxProps {
  children?: JSX.Element | JSX.Element[];
  scrollable?: boolean;
  mt?: string;
  onScroll?: () => void;
}

export const ScreenBox = ({
  scrollable,
  children,
  onScroll,
}: ScreenBoxProps) => {
  return (
    <>
      {scrollable && (
        <ScrollView>
          <Box w="100%" flex={1} px="4" py="4" backgroundColor="coolGray.800">
            {children}
          </Box>
        </ScrollView>
      )}
      {!scrollable && (
        <Box w="100%" flex={1} px="4" py="4" backgroundColor="coolGray.800">
          {children}
        </Box>
      )}
    </>
  );
};
