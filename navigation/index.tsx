/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import SignInScreen from "../screens/onboarding/SignInScreen";
import HomeScreen from "../screens/HomeScreen";
import PostDetailsScreen from "../screens/post/PostDetailsScreen";
import SearchScreen from "../screens/SearchScreen";
import EditProfileScreen from "../screens/settings/EditProfileScreen";
import SuggestionScreen from "../screens/settings/SuggestionScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import PrivacyPolicyScreen from "../screens/settings/PrivacyPolicyScreen";
import ChangePasswordScreen from "../screens/settings/ChangePasswordScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import TermsOfUseScreen from "../screens/settings/TermsOfUseScreen";
import {
  RootStackParamList,
  RootTabParamList,
  AuthenticatedStackParamList,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import SignUpScreen from "../screens/onboarding/SignUpScreen";
import { OnboardingStep, useAuth } from "../stores/useAuth";
import { theme } from "native-base";
import CustomizeTopicsScreen from "../screens/settings/CustomizeTopicsScreen";
import PushNotificationsSettingsScreen from "../screens/settings/PushNotificationsSettingsScreen";
import { SubtitleHeading } from "../components/base/Headings";
import LandingScreen from "../screens/onboarding/LandingScreen";
import SignUpYoutube from "../screens/onboarding/SignUpYoutube";
import ScreenNameScreen from "../screens/onboarding/ScreenNameScreen";
import NichesScreen from "../screens/onboarding/NichesScreen";
import TopicsScreen from "../screens/onboarding/TopicsScreen";
import { MyTabBar } from "./MyTabBar";
import { useModal } from "../stores/useModal";
import { CreateAPostModal } from "../components/CreateAPostModal";
import { ParagraphText } from "../components/base/Texts";
import SelectTopicScreen from "../screens/post/SelectTopicScreen";
import AddAUrlScreen from "../screens/post/AddAUrlScreen";
import AddBrandsScreen from "../screens/post/AddBrandsScreen";
import BrandReviews from "../screens/brand-reviews/BrandReviews";
import AddAPostScreen from "../screens/post/AddAPostScreen";
import PostReviewModal from "../screens/brand-reviews/BrandReviewModal";
import AddAPollScreen from "../screens/post/AddAPollScreen";
import BookmarksScreen from "../screens/settings/BookmarksScreen";

export default function Navigation() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      background: theme.colors.coolGray[800],
      text: theme.colors.white,
      border: theme.colors.coolGray[800],
      primary: theme.colors.yellow[300],
    },
  };

  return (
    <NavigationContainer linking={LinkingConfiguration} theme={MyTheme}>
      <RootNavigator />
      <CreateAPostModal />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthenticatedStack =
  createNativeStackNavigator<AuthenticatedStackParamList>();

function AuthenticatedNavigator() {
  const navigation = useNavigation();

  return (
    <AuthenticatedStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.coolGray[800],
        },
        headerBackTitle: "",
        headerTintColor: "#fff",
        headerTitle: (props) => (
          <SubtitleHeading>{props.children}</SubtitleHeading>
        ),
        headerLeft: (props) => (
          <FontAwesome
            onPress={() => {
              if (props.canGoBack) navigation.goBack();
            }}
            name="chevron-left"
            size={20}
            color="#fff"
          />
        ),
      }}
    >
      <AuthenticatedStack.Screen
        name="BottomTab"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="PushNotificationsSettingsScreen"
        component={PushNotificationsSettingsScreen}
        options={{
          title: "Push Notifications",
        }}
      />
      <AuthenticatedStack.Screen
        name="BookmarksScreen"
        component={BookmarksScreen}
        options={{
          title: "Bookmarks",
        }}
      />
      <AuthenticatedStack.Screen
        name="CustomizeTopicsScreen"
        component={CustomizeTopicsScreen}
        options={{
          title: "Customize Topics",
        }}
      />
      <AuthenticatedStack.Screen
        name="PostDetailsScreen"
        component={PostDetailsScreen}
        options={{
          title: "Post Details",
        }}
      />
      <AuthenticatedStack.Screen
        name="BrandReviews"
        component={BrandReviews}
        options={({ route }) => ({ title: route?.params?.name })}
      />
      <AuthenticatedStack.Screen
        name="PostReviewModal"
        component={PostReviewModal}
        options={{
          presentation: "fullScreenModal",
          title: "Review a Brand",
          headerLeft: (props) => (
            <ParagraphText
              onPress={() => {
                if (props.canGoBack) navigation.goBack();
              }}
            >
              Close
            </ParagraphText>
          ),
        }}
      />

      <AuthenticatedStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          title: "Change Password",
        }}
      />
      <AuthenticatedStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
        }}
      />
      <AuthenticatedStack.Screen
        name="CreateAPostScreen"
        component={SelectTopicScreen}
        options={{
          title: "Pick Topic",
          animation: "slide_from_bottom",
          headerLeft: (props) => (
            <ParagraphText
              onPress={() => {
                if (props.canGoBack) navigation.goBack();
              }}
            >
              Close
            </ParagraphText>
          ),
        }}
      />
      <AuthenticatedStack.Screen
        name="AddAUrlScreen"
        component={AddAUrlScreen}
        options={({ route }) => ({ title: route?.params?.topic?.name })}
      />
      <AuthenticatedStack.Screen
        name="AddAPostScreen"
        component={AddAPostScreen}
        options={({ route }) => ({ title: route?.params?.topic?.name })}
      />
      <AuthenticatedStack.Screen
        name="AddAPollScreen"
        component={AddAPollScreen}
        options={({ route }) => ({ title: route?.params?.topic?.name })}
      />
      <AuthenticatedStack.Screen
        name="AddBrandsScreen"
        component={AddBrandsScreen}
        options={{
          title: "Select Brands",
        }}
      />
      <AuthenticatedStack.Screen
        name="SuggestionScreen"
        options={{
          title: "Suggest a Feature",
        }}
      >
        {(props) => (
          <SuggestionScreen
            {...props}
            label="Request a feature"
            placeholder="I would like to see a feature"
            hint="Is there a feature you'd like to see on the app? Please send us a request"
          />
        )}
      </AuthenticatedStack.Screen>
      <AuthenticatedStack.Screen
        name="TermsOfUseScreen"
        component={TermsOfUseScreen}
        options={{
          title: "Terms of Use"
        }}
       />
      <AuthenticatedStack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{
          title: "Privacy Policy"
        }}
      />
    </AuthenticatedStack.Navigator>
  );
}

function RootNavigator({}) {
  const auth = useAuth();
  const navigation = useNavigation();
  const onboardingConfig = {
    headerStyle: {
      backgroundColor: theme.colors.blueGray[800],
    },
    title: "",
    headerBackTitle: "",
    headerTintColor: "#fff",
    headerTitle: (props: any) => (
      <SubtitleHeading>{props.children}</SubtitleHeading>
    ),
    headerLeft: (props: any) => (
      <FontAwesome
        onPress={() => {
          if (props.canGoBack) navigation.goBack();
        }}
        name="chevron-left"
        size={20}
        color="#fff"
      />
    ),
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.coolGray[800],
        },
        headerTitleStyle: {},
        headerTitle: (props) => (
          <SubtitleHeading>{props.children}</SubtitleHeading>
        ),
        animationTypeForReplace: auth?.loggedIn ? "push" : "pop",
      }}
    >
      {auth?.loggedIn && auth?.onboardingStep === OnboardingStep.BottomTab ? (
        <Stack.Screen
          name="Root"
          component={AuthenticatedNavigator}
          options={{ headerShown: false, animation: "none" }}
        />
      ) : (
        <>
          {auth?.onboardingStep === OnboardingStep.LandingScreen && (
            <>
              <Stack.Screen
                name="LandingScreen"
                component={LandingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUpYoutube"
                component={SignUpYoutube}
                options={{ ...onboardingConfig }}
              />
              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{ ...onboardingConfig }}
              />
              <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{
                  ...onboardingConfig,
                }}
              />
              <Stack.Screen
                name="TermsOfUseScreen"
                component={TermsOfUseScreen}
                options={{
                  ...onboardingConfig,
                }}
              />
              <Stack.Screen
                name="PrivacyPolicyScreen"
                component={PrivacyPolicyScreen}
                options={{
                  ...onboardingConfig,
                }}
              />
              <Stack.Screen
                name="ScreenNameScreen"
                component={ScreenNameScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NichesScreen"
                component={NichesScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TopicsScreen"
                component={TopicsScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
          {auth?.onboardingStep === OnboardingStep.ScreenNameScreen && (
            <>
              <Stack.Screen
                name="ScreenNameScreen"
                component={ScreenNameScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NichesScreen"
                component={NichesScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TopicsScreen"
                component={TopicsScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
          {auth?.onboardingStep === OnboardingStep.NichesScreen && (
            <>
              <Stack.Screen
                name="NichesScreen"
                component={NichesScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TopicsScreen"
                component={TopicsScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
          {auth?.onboardingStep === OnboardingStep.TopicsScreen && (
            <Stack.Screen
              name="TopicsScreen"
              component={TopicsScreen}
              options={{ headerShown: false }}
            />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const modal = useModal();

  return (
    <BottomTab.Navigator
      tabBar={(props) => <MyTabBar {...props} openModal={modal?.setOpen} />}
      initialRouteName="Topics"
      screenOptions={{
        headerShown: true,
        headerTitle: (props) => (
          <SubtitleHeading>{props.children}</SubtitleHeading>
        ),
        tabBarLabel: () => {
          return null;
        },
      }}
    >
      <BottomTab.Screen
        name="Topics"
        component={HomeScreen}
        options={() => ({
          title: "Topics",
          icon: "home",
        })}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={() => ({
          title: "Search",
          icon: "search",
        })}
      />
      <BottomTab.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={() => ({
          title: "Notifications",
          icon: "bell",
        })}
      />
      <BottomTab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={() => ({
          title: "Settings",
          icon: "gear",
        })}
      />
      <BottomTab.Screen
        name="PostScreen"
        component={SelectTopicScreen}
        options={() => ({
          title: "",
          icon: "edit",
        })}
      />
    </BottomTab.Navigator>
  );
}
