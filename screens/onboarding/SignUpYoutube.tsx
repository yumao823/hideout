import * as React from "react";
import { VStack, HStack, Box } from "native-base";
import { useNavigation } from "@react-navigation/core";
import * as AuthSession from "expo-auth-session";

import { ScreenBox } from "../../components/ScreenBox";
import { ParagraphText } from "../../components/base/Texts";
import { HeroHeading } from "../../components/base/Headings";
import { HiddenButton, PrimaryButton } from "../../components/base/Buttons";
import { supabase } from "../../supabase";

const redirectUri = AuthSession.makeRedirectUri({ useProxy: false });
const provider = "google";

export default function SignUpYoutube() {
  const navigation = useNavigation();

  return (
    <ScreenBox>
      <VStack justifyContent="space-between" flex={1} py="6">
        <Box>
          <VStack space="2">
            <HeroHeading>
              Get the most out of{" "}
              <HeroHeading color="yellow.400">hideout</HeroHeading> sign up with
              youtube
            </HeroHeading>
            <ParagraphText mt="1" mb="8">
              Your youtube account is ONLY used for verification and will not
              appear publicly anywhere in the app
            </ParagraphText>
            <PrimaryButton
              mb="1"
              onPress={async () => {
                try {
                  const response = await AuthSession.startAsync({
                    authUrl: `https://edtiyjubhafpeefmhqed.supabase.co/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUri}&scopes=https://www.googleapis.com/auth/yt-analytics.readonly,https://www.googleapis.com/auth/yt-analytics-monetary.readonly,https://www.googleapis.com/auth/youtube,https://www.googleapis.com/auth/youtubepartner`,
                    returnUrl: redirectUri,
                  });

                  if (!response) return;
                  const { user, session, error } = await supabase.auth.signIn({
                    refreshToken: response.params?.refresh_token,
                  });

                  if (user) {
                    await supabase
                      .from("users")
                      .insert([
                        { uuid: user.id, email: user.email, verified: true },
                      ]);
                  }

                  navigation.navigate("ScreenNameScreen");
                  // const userYoutubeInfoResponse = await fetch(
                  //   "https://youtubeanalytics.googleapis.com/v2/reports",
                  //   {
                  //     method: "GET",
                  //     headers: {
                  //       Authorization: `Bearer ${response.params?.provider_token}`,
                  //     },
                  // body: JSON.stringify({
                  //   firstParam: 'yourValue'
                  // })
                  //   }
                  // );

                  // const rezyy = await userYoutubeInfoResponse.json();
                  // console.log(rezyy);
                } catch (e) {
                  console.log("error", e);
                }
              }}
            >
              Signup with Youtube
            </PrimaryButton>
            <HStack justifyContent="center">
              <ParagraphText>
                By creating an account, you agree to our{" "}
                <ParagraphText
                  textDecorationLine="underline"
                  onPress={() => navigation.navigate("TermsOfUseScreen")}
                >
                  Terms of Use
                </ParagraphText>{" "}
                and{" "}
                <ParagraphText
                  textDecorationLine="underline"
                  onPress={() => navigation.navigate("PrivacyPolicyScreen")}
                >
                  Privacy Policy.
                </ParagraphText>
              </ParagraphText>
            </HStack>
          </VStack>
        </Box>

        <VStack space={3} mt="5">
          <HStack justifyContent="center">
            <ParagraphText>Don’t have a Youtube account? </ParagraphText>
          </HStack>
          <HiddenButton onPress={() => navigation.navigate("SignUpScreen")}>
            Signup with Email
          </HiddenButton>
        </VStack>
      </VStack>
    </ScreenBox>
  );
}
