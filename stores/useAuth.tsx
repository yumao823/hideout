import { User as SupabaseUser } from "@supabase/gotrue-js";
import { first } from "lodash";
import React, { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabase";

interface AppContextInterface {
  user: User | null;
  loggedIn: boolean;
  loading: boolean;
  onboardingStep: OnboardingStep;
  fetchUser: (userId?: string) => void;
}

const AuthContext = createContext<AppContextInterface | null>(null);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

export enum OnboardingStep {
  LandingScreen = "LandingScreen",
  ScreenNameScreen = "ScreenNameScreen",
  NichesScreen = "NichesScreen",
  TopicsScreen = "TopicsScreen",
  BottomTab = "BottomTab",
}

export interface User extends SupabaseUser {
  screen_name: string;
  user_niches: string[];
  user_topics: string[];
  verified?: boolean;
  years_of_exp?: number;
  bio?: string;
  location?: string;
}

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(
    OnboardingStep.LandingScreen
  );

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  const fetchUser = async (userId?: string) => {
    const res = await supabase
      .from("users")
      .select(
        `
        uuid,
        screen_name,
        verified,
        location,
        bio,
        years_of_exp,
        enable_push_notifications,
        push_new_messages,
        push_new_comments,
        push_posts,
        push_app_updates,
        user_niches (
          id
        ),
        user_topics (
          id
        )
      `
      )
      .eq("uuid", userId);

    const resUser = first(res?.data);

    if (resUser) {
      setUser({
        ...user,
        ...resUser,
      });
    }

    if (!resUser?.screen_name) {
      setOnboardingStep(OnboardingStep.ScreenNameScreen);
      setLoading(false);

      return;
    }

    if (!resUser?.user_niches.length) {
      setOnboardingStep(OnboardingStep.NichesScreen);
      setLoading(false);

      return;
    }

    if (!resUser?.user_topics.length) {
      setOnboardingStep(OnboardingStep.TopicsScreen);
      setLoading(false);

      return;
    }

    setOnboardingStep(OnboardingStep.BottomTab);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchUser(user?.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (supabase.auth.user()) {
      setUser(supabase.auth.user());
      setLoggedIn(true);
    } else {
      setLoading(false);
    }

    const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(supabase.auth.user());
        setLoggedIn(true);

        return;
      }

      setLoggedIn(false);
      setUser(null);
      setOnboardingStep(OnboardingStep.LandingScreen);
    });

    // Cleanup subscription on unmount
    return () => {
      // if (unsubscribe) unsubscribe();
    };
  }, []);

  // Return the user object and auth methods
  return {
    user,
    loggedIn,
    loading,
    onboardingStep,
    fetchUser,
  };
}
