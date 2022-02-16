/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type OnboardingStackParamList = {};

export type AuthenticatedStackParamList = {
  ScreenNameScreen: undefined;
  NichesScreen: undefined;
  TopicsScreen: undefined;
  BottomTab: NavigatorScreenParams<RootTabParamList> | undefined;
  EditProfileScreen: undefined;
  PushNotificationsSettingsScreen: undefined;
  ChangePasswordScreen: undefined;
  CustomizeTopicsScreen: undefined;
  SuggestionScreen: undefined;
  BrandReviews: undefined;
  CreateAPostScreen: undefined;
  AddTitleScreen: undefined;
  PostDetailsScreen: undefined;
  TermsOfUseScreen: undefined;
  PrivacyPolicyScreen: undefined;
};

export type RootStackParamList = {
  Root: NavigatorScreenParams<AuthenticatedStackParamList> | undefined;
  LandingScreen: undefined;
  SignUpYoutube: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  ScreenNameScreen: undefined;
  NichesScreen: undefined;
  TopicsScreen: undefined;
  BottomTab: undefined;
  EditProfileScreen: undefined;
  PushNotificationsSettingsScreen: undefined;
  ChangePasswordScreen: undefined;
  CustomizeTopicsScreen: undefined;
  SuggestionScreen: undefined;
  PostDetailsScreen: undefined;
  TermsOfUseScreen: undefined;
  PrivacyPolicyScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Topics: undefined;
  Search: undefined;
  SettingsScreen: undefined;
  NotificationsScreen: undefined;
  PostScreen: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
