import * as React from "react";
import { Image, VStack, HStack, Box, theme } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { ScreenBox } from "../../components/ScreenBox";
import { ParagraphText } from "../../components/base/Texts";
import { HeroHeading } from "../../components/base/Headings";
import { PrimaryButton } from "../../components/base/Buttons";
import Swiper from "react-native-web-swiper";

export default function LandingScreen() {
  const navigation = useNavigation();
  return (
    <ScreenBox>
      <VStack justifyContent="space-between" flex={1} py="6">
        <Box />
        <Box height="300">
          <Swiper
            controlsProps={{
              prevTitle: "",
              nextTitle: "",
              dotActiveStyle: {
                backgroundColor: theme.colors.yellow[400],
              },
            }}
            loop={true}
            timeout={3}
          >
            <VStack justifyContent="center" alignItems="center">
              <Image
                alt="image"
                size={70}
                mb="8"
                source={require("../../assets/images/shield-unlock.png")}
              />
              <HeroHeading textAlign="center">
                Welcome to <HeroHeading color="yellow.400">hideout</HeroHeading>{" "}
                a networking app{" "}
              </HeroHeading>
              <ParagraphText mt="1" textAlign="center">
                Work with the top employers in the tech industy and chat with
                the people who work there
              </ParagraphText>
            </VStack>
            <VStack justifyContent="center" alignItems="center">
              <Image
                alt="image"
                size={70}
                mb="8"
                source={require("../../assets/images/shield-unlock.png")}
              />
              <HeroHeading textAlign="center">
                Welcome to <HeroHeading color="yellow.400">hideout</HeroHeading>{" "}
                a networking app{" "}
              </HeroHeading>
              <ParagraphText mt="1" textAlign="center">
                Work with the top employers in the tech industy and chat with
                the people who work there
              </ParagraphText>
            </VStack>
            <VStack justifyContent="center" alignItems="center">
              <Image
                alt="image"
                size={70}
                mb="8"
                source={require("../../assets/images/shield-unlock.png")}
              />
              <HeroHeading textAlign="center">
                Welcome to <HeroHeading color="yellow.400">hideout</HeroHeading>{" "}
                a networking app{" "}
              </HeroHeading>
              <ParagraphText mt="1" textAlign="center">
                Work with the top employers in the tech industy and chat with
                the people who work there
              </ParagraphText>
            </VStack>
          </Swiper>
        </Box>

        <VStack space={3} mt="5">
          <PrimaryButton onPress={() => navigation.navigate("SignUpYoutube")}>
            Get Started
          </PrimaryButton>
        </VStack>
      </VStack>
    </ScreenBox>
  );
}
