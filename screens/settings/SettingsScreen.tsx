import { Box, Image, HStack, Spacer } from "native-base";
import * as React from "react";
import Constants from "expo-constants"

import { supabase } from "../../supabase";
import { useAuth } from "../../stores/useAuth";
import { RootTabScreenProps } from "../../types";
import { SettingsItem } from "../../components/SettingsItem";
import { ScreenBox } from "../../components/ScreenBox";
import {
  SubtitleHeading,
  HeroHeading,
  TitleHeading,
} from "../../components/base/Headings";
import { ParagraphText } from "../../components/base/Texts";
import { HiddenButton } from "../../components/base/Buttons";

export default function SettingsScreen({
  navigation,
}: RootTabScreenProps<"SettingsScreen">) {
  const auth = useAuth();
  const version = Constants.manifest.version

  return (
    <ScreenBox scrollable>
      <ParagraphText>{auth?.user?.email}</ParagraphText>
      <HeroHeading mb="3">{auth?.user?.screen_name}</HeroHeading>
      {!auth?.user?.verified && (
        <Box
          p="3"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.700"
          borderWidth="1"
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
        >
          <HStack alignItems="center">
            <Image
              alt="image"
              size={30}
              source={require("../../assets/images/shield-unlock.png")}
            />
            <SubtitleHeading ml="2">
              Verify your account to unlock
            </SubtitleHeading>
          </HStack>
          <HStack alignItems="center" mt="2">
            <Image
              alt="image"
              size={5}
              source={require("../../assets/images/sm-check-circle.png")}
            />
            <ParagraphText ml="2">Salary comparison tool</ParagraphText>
          </HStack>
          <HStack alignItems="center" mt="2">
            <Image
              alt="image"
              size={5}
              source={require("../../assets/images/sm-check-circle.png")}
            />
            <ParagraphText ml="2">View poll requests</ParagraphText>
          </HStack>
          <HStack alignItems="center" mt="2">
            <Image
              alt="image"
              size={5}
              source={require("../../assets/images/sm-check-circle.png")}
            />
            <ParagraphText ml="2">Post Content and DOM</ParagraphText>
          </HStack>
        </Box>
      )}
      <TitleHeading mt="6" mb="5">
        Account
      </TitleHeading>
      <SettingsItem name="Customize Topics" path="CustomizeTopicsScreen" />
      <SettingsItem name="Edit Profile" path="EditProfileScreen" />
      <SettingsItem name="Bookmarks" path="BookmarksScreen" />
      <SettingsItem name="Salary Comparision" path="" />

      <TitleHeading mt="2" mb="5">
        App Settings
      </TitleHeading>
      {!auth?.user?.verified && (
        <SettingsItem name="Change Password" path="ChangePasswordScreen" />
      )}
      <SettingsItem
        name="Push Notification"
        path="PushNotificationsSettingsScreen"
      />

      <TitleHeading mt="2" mb="5">
        About
      </TitleHeading>
      <SettingsItem name="Suggest a Feature" path="SuggestionScreen" />
      <SettingsItem name="Terms of Use" path="TermsOfUseScreen" />
      <SettingsItem name="Privacy Policy" path="PrivacyPolicyScreen" />
      <HStack mb={7}>
        <ParagraphText>Version</ParagraphText>
        <Spacer />
        <ParagraphText>v {version}</ParagraphText>
      </HStack>

      <HiddenButton
        mt="2"
        onPress={() => {
          supabase.auth.signOut();
        }}
      >
        Sign out
      </HiddenButton>
    </ScreenBox>
  );
}
