import * as React from "react";
import { VStack, FormControl, HStack, Box, useToast } from "native-base";
import { supabase } from "../../supabase";
import { ScreenBox } from "../../components/ScreenBox";
import { Input } from "../../components/base/Input";
import { PrimaryButton } from "../../components/base/Buttons";
import { HelperText, ParagraphText } from "../../components/base/Texts";
import { HeroHeading } from "../../components/base/Headings";
import { useNavigation } from "@react-navigation/core";

export default function SignUpScreen() {
  const toast = useToast();
  const navigation = useNavigation();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const signupUser = async () => {
    try {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        toast.show({
          title: "Error signing up",
          status: "warning",
          placement: "top",
          description: error.message,
        });

        return;
      }

      if (user) {
        await supabase.from("users").insert([{ uuid: user.id, email }]);
      }

      navigation.navigate("ScreenNameScreen");
    } catch (error) {
      console.log("Something went wrong with sign up: ", error);
    }
  };

  return (
    <ScreenBox>
      <VStack
        justifyContent="space-between"
        flexDirection="column"
        flex={1}
        paddingBottom="6"
      >
        <Box>
          <HeroHeading mb="4">Sign up</HeroHeading>
          <Box
            style={{ backgroundColor: "#64695f" }}
            borderRadius="4"
            padding="2"
          >
            <ParagraphText color="yellow.400">
              Creating an account with email will give you limited access to
              content and features but you can always verify later
            </ParagraphText>
          </Box>
          <VStack space={3} mt="5">
            <FormControl>
              <ParagraphText>Email</ParagraphText>
              <Input onChangeText={setEmail} />
            </FormControl>
            <FormControl>
              <ParagraphText>Password</ParagraphText>
              <Input type="password" onChangeText={setPassword} />
              <HelperText>
                Enter a password (8-32 characters, include at least one letter
                and number)
              </HelperText>
            </FormControl>
            <HStack justifyContent="center">
              <ParagraphText>
                By creating an account, you agree to our{" "}
                <ParagraphText textDecorationLine="underline">
                  Terms of Use
                </ParagraphText>{" "}
                and{" "}
                <ParagraphText textDecorationLine="underline">
                  Privacy Policy.
                </ParagraphText>
              </ParagraphText>
            </HStack>
          </VStack>
        </Box>
        <PrimaryButton mt="2" onPress={signupUser}>
          Sign up
        </PrimaryButton>
      </VStack>
    </ScreenBox>
  );
}
