import * as React from "react";
import { VStack, FormControl, useToast, Box } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { supabase } from "../../supabase";
import { ScreenBox } from "../../components/ScreenBox";
import { Input } from "../../components/base/Input";
import { ParagraphText } from "../../components/base/Texts";
import { HeroHeading } from "../../components/base/Headings";
import { SecondaryButton, PrimaryButton } from "../../components/base/Buttons";
import { useAuth } from "../../stores/useAuth";

export default function SignInScreen({}) {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const toast = useToast();
  const auth = useAuth();

  const signinUser = async () => {
    try {
      const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      });

      if (error) {
        toast.show({
          title: "Error signing in",
          status: "warning",
          placement: "top",
          description: error.message,
        });

        return;
      }

      await auth?.fetchUser(supabase.auth.user().id);
    } catch (error) {
      console.log("Something went wrong with sign in: ", error);
    }
  };

  return (
    <ScreenBox>
      <VStack justifyContent="space-between" flex={1} pb="6">
        <Box>
          <HeroHeading>Welcome</HeroHeading>
          <ParagraphText mt="1">Sign in to continue!</ParagraphText>

          <VStack space={3} mt="5">
            <FormControl>
              <ParagraphText>Email ID</ParagraphText>
              <Input onChangeText={setEmail} />
            </FormControl>
            <FormControl>
              <ParagraphText>Password</ParagraphText>
              <Input type="password" onChangeText={setPassword} />
              <ParagraphText
                alignSelf="flex-end"
                mt="1"
                textDecorationLine="underline"
              >
                Forget Password?
              </ParagraphText>
            </FormControl>
            <PrimaryButton onPress={signinUser}>Sign in</PrimaryButton>
          </VStack>
        </Box>
        <SecondaryButton>Signin with Youtube</SecondaryButton>
      </VStack>
    </ScreenBox>
  );
}
