import * as React from "react";
import { VStack, FormControl, useToast, Box } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { supabase } from "../../supabase";
import { ScreenBox } from "../../components/ScreenBox";
import { Input } from "../../components/base/Input";
import { HelperText, ParagraphText } from "../../components/base/Texts";
import { HeroHeading } from "../../components/base/Headings";
import { PrimaryButton } from "../../components/base/Buttons";
import { useAuth } from "../../stores/useAuth";

export default function ScreenNameScreen() {
  const [screenName, setScreenName] = React.useState("");
  const navigation = useNavigation();
  const toast = useToast();
  const auth = useAuth();

  const submit = async () => {
    try {
      if (screenName.length < 5) {
        toast.show({
          title: "Error adding screen name",
          status: "warning",
          placement: "top",
          description: "Please pick a screen name longer than 5 characters",
        });

        return;
      }

      if (!/^(?:[A-Za-z]+|\d+)$/.test(screenName)) {
        toast.show({
          title: "Error adding screen name",
          status: "warning",
          placement: "top",
          description:
            "Your screen name may only contain letters, numbers and '_'",
        });

        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("screen_name")
        .eq("screen_name", screenName);

      if (data?.length) {
        toast.show({
          title: "Error adding screen name",
          status: "warning",
          placement: "top",
          description: "This screen name is already taken please pick another",
        });

        return;
      }

      await supabase
        .from("users")
        .update({
          screen_name: screenName,
        })
        .match({ uuid: auth?.user?.id });

      navigation.navigate("NichesScreen");
    } catch (error) {
      console.log("Something went wrong with sign in: ", error);
    }
  };

  return (
    <ScreenBox>
      <VStack justifyContent="space-between" flex={1} pb="6" mt="12">
        <Box>
          <HeroHeading>Create a screen name</HeroHeading>
          <ParagraphText mt="1">
            Your screen name will be what other user see when viewing your
            profile but will not tied to your email address
          </ParagraphText>

          <VStack space={3} mt="5">
            <FormControl>
              <ParagraphText>Screen Name</ParagraphText>
              <Input onChangeText={setScreenName} />
              <HelperText>(5-32 characters)</HelperText>
            </FormControl>
          </VStack>
        </Box>
        <PrimaryButton onPress={submit}>Continue</PrimaryButton>
      </VStack>
    </ScreenBox>
  );
}
