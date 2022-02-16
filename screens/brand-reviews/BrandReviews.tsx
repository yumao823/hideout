import React, { useEffect, useState } from "react";
import { Box, Flex, Image, ScrollView, Spacer, theme } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Accordion from "react-native-collapsible/Accordion";

import {
  TitleHeading,
  SubtitleHeading,
  HeroHeading,
} from "../../components/base/Headings";
import { LabelText, ParagraphText } from "../../components/base/Texts";
import { PrimaryButton, FeedBackButton } from "../../components/base/Buttons";
import { PopularItem } from "../../components/PopularItem";
import { supabase } from "../../supabase";
import { definitions } from "../../types/supabase";
import { Dimensions, Linking } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Info = ({
  brand: { founded, size, description },
}: {
  brand: definitions["brands"];
}) => {
  return (
    <Box py="12">
      <SubtitleHeading>Founded</SubtitleHeading>
      <ParagraphText mb={3}>{founded}</ParagraphText>
      <SubtitleHeading>Size</SubtitleHeading>
      <ParagraphText mb={3}>{size}+ employees</ParagraphText>
      <SubtitleHeading>Description</SubtitleHeading>
      <ParagraphText>{description}</ParagraphText>
    </Box>
  );
};

const Reviews = ({ reviews }: { reviews: definitions["reviews"][] }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {reviews?.map((review) => (
        <Box py="8">
          <Flex flexDirection="row" alignItems="center">
            {Array.from(Array(review?.overrall_rating).keys()).map((i) => (
              <FontAwesome
                key={i}
                name="star"
                color={theme.colors.yellow[400]}
                size={20}
              />
            ))}
          </Flex>
          <TitleHeading my={3}>{review?.title}</TitleHeading>
          <SubtitleHeading>Pros</SubtitleHeading>
          <LabelText mb={3}>{review?.pros}</LabelText>
          <SubtitleHeading>Cons</SubtitleHeading>
          <LabelText>{review?.cons}</LabelText>
        </Box>
      ))}
    </ScrollView>
  );
};

const Posts = ({ posts }: { posts: definitions["posts"][] }) => {
  return (
    <ScrollView py="6">
      {posts?.map((item) => (
        <PopularItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

const WouldWorkWithCard = ({ brand }: { brand: definitions["brands"] }) => {
  let [active, setActive] = useState(false);

  return (
    <Box>
      <Accordion
        activeSections={[active ? 0 : 1]}
        sections={["Section 1"]}
        underlayColor={"transparent"}
        renderHeader={() => (
          <>
            <SubtitleHeading textAlign="center" mt={5}>
              {`Would you work with ${brand?.name}?`}
            </SubtitleHeading>
            <Flex flexDirection="row" justifyContent="center">
              <FeedBackButton
                type="dislike"
                percent={74}
                active={active}
                onPress={() => setActive(!active)}
              />
              <FeedBackButton
                type="like"
                percent={26}
                active={active}
                onPress={() => setActive(!active)}
              />
            </Flex>
          </>
        )}
        renderContent={() => (
          <LabelText textAlign="center" mx={5} mb={10}>
            {`24% of users on Hideout answered that they would like to work with ${brand?.name}`}{" "}
          </LabelText>
        )}
        onChange={() => {}}
      />
    </Box>
  );
};

const Tab = createMaterialTopTabNavigator();

export default function BrandReviews({ navigation, route }) {
  const [reviews, setReviews] = useState<definitions["reviews"][]>([]);
  const [posts, setPosts] = useState<definitions["posts"][]>([]);

  const brand: definitions["brands"] = route.params;

  const rating = 5;

  const fetchPosts = async () => {
    const res = await supabase
      .from("posts_related_brands")
      .select(`uuid, post (uuid, title, description, views, type, created_at)`)
      .eq("brand", brand?.uuid);

    setPosts(res.data?.map((item) => item?.post));
  };

  const fetchReviews = async () => {
    const res = await supabase
      .from("reviews")
      .select()
      .eq("brand", brand?.uuid);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
    fetchPosts();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ height: 900 }}
      px="4"
      pb="4"
    >
      <Box
        borderWidth={0.5}
        borderRadius={4}
        borderColor="coolGray.800"
        bg="coolGray.700"
        paddingX={3}
        marginRight={3}
        alignSelf="flex-start"
        mb={2}
      >
        <LabelText color="coolGray.400">{brand?.industry}</LabelText>
      </Box>
      <Flex flexDirection="row" alignItems="center" mb="1">
        <Image
          size={25}
          mr={2}
          source={{ uri: brand?.thumbnail }}
          alt="figma"
        />
        <HeroHeading mr={2}>{brand?.name}</HeroHeading>
        <Spacer />
        <TouchableOpacity onPress={() => Linking.openURL(brand?.website)}>
          <Image
            size={15}
            source={require("../../assets/images/external.png")}
            alt="link_to_brand_website"
          />
        </TouchableOpacity>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        {Array.from(Array(rating).keys()).map((i) => (
          <FontAwesome
            key={i}
            name="star"
            color={theme.colors.yellow[400]}
            size={20}
          />
        ))}
        <LabelText ml={2}>
          {reviews?.length} {reviews.length === 1 ? "review" : "reviews"}
        </LabelText>
      </Flex>
      <Flex flexDirection="row" alignItems="flex-end" mb="6" mt="4">
        <Image
          size={18}
          source={require("../../assets/images/location.png")}
          alt="location"
          mr={3}
        />
        <LabelText color="coolGray.500">{brand?.location}</LabelText>
        <Spacer />
        <PrimaryButton
          py={1}
          onPress={() =>
            navigation.navigate("PostReviewModal", {
              brand_uuid: brand?.uuid,
              brand_thumbnail: brand?.thumbnail,
              brand_name: brand?.name,
            })
          }
        >
          Write a Review
        </PrimaryButton>
      </Flex>
      <WouldWorkWithCard brand={brand} />
      <Tab.Navigator
        initialLayout={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: "Rubik_700Bold",
            textTransform: "capitalize",
          },
        }}
      >
        <Tab.Screen name="Info" options={{ title: "Info" }}>
          {(props) => <Info brand={brand} {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Reviews" options={{ title: "Reviews" }}>
          {(props) => <Reviews reviews={reviews} {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Posts" options={{ title: "Posts" }}>
          {(props) => <Posts posts={posts} {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </ScrollView>
  );
}
