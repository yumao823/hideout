import * as React from "react";
import { Text, VStack, FormControl, Input, Button, Spacer } from "native-base";
import { ScreenBox } from "../../components/ScreenBox";

export default function ChangePasswordScreen() {
  return (
    <ScreenBox>
      <VStack space={3} h="100%">
        <FormControl>
          <Text color="light.200" fontSize="16">
            Current Password
          </Text>
          <Input
            type="password"
            placeholder="password"
            fontSize={15}
            placeholderTextColor="white"
          />
          <Text color="light.400" alignSelf="flex-start" fontSize={13} mt="1">
            Enter your current password
          </Text>
        </FormControl>
        <FormControl>
          <Text color="light.200" fontSize="16">
            New Password
          </Text>
          <Input
            type="password"
            placeholder="new password"
            fontSize={15}
            placeholderTextColor="white"
          />
          <Text color="light.400" alignSelf="flex-start" mt="1">
            Enter a new password (8-32 characters, include at least one letter
            and number)
          </Text>
        </FormControl>
        <FormControl>
          <Text color="light.200" fontSize="16">
            Confirm New Password
          </Text>
          <Input
            type="password"
            placeholder="new password"
            fontSize={15}
            placeholderTextColor="white"
          />
          <Text color="light.400" alignSelf="flex-start" mt="1">
            Re-enter new password
          </Text>
        </FormControl>
        <Spacer />
        <Button
          mb="5"
          size="lg"
          colorScheme="primary"
          _text={{ color: "coolGray.700" }}
        >
          Change Password
        </Button>
      </VStack>
    </ScreenBox>
  );
}
