import * as React from "react";
import { FlatList, VStack } from "native-base";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { ScreenBox } from "../components/ScreenBox";
import { TitleHeading } from "../components/base/Headings";
import { PopularItem } from "../components/PopularItem";
import { supabase } from "../supabase";
import { definitions } from "../types/supabase";
import { useAuth } from "../stores/useAuth";
import * as Haptics from "expo-haptics";

const FETCH_POSTS = `
id,
uuid,
created_at,
title,
description,
url,
type,
views,
participants:poll_answers(count),
likes:post_likes(
  uuid,
  user
),
commentCount:comments(count),
topic (
  uuid,
  name
)
`;

const HomeScreen = () => {
  const [posts, setPosts] = React.useState<definitions["posts"][]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const auth = useAuth();

  async function fetchData() {
    const postData = await supabase
      .from("posts")
      .select(FETCH_POSTS)
      .order("created_at", { ascending: false });

    if (postData.data) {
      setPosts(postData.data);
    }

    if (postData.error) {
      console.log(postData.error.message);
    }
  }

  React.useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const handleLike = async (
    hasLiked: boolean,
    postId?: string,
    likeUuid?: string
  ) => {
    if (!hasLiked) {
      await supabase
        .from("post_likes")
        .insert([{ post: postId, user: auth?.user?.id }]);
    } else {
      await supabase.from("post_likes").delete().eq("uuid", likeUuid);
    }

    fetchData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScreenBox scrollable>
      <VStack space={5} h="100%">
        <TitleHeading>Popular</TitleHeading>
        <FlatList
          data={posts || []}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => {
            const likeObj = item.likes?.find(
              (like: any) => like.user === auth?.user?.id
            );
            return (
              <PopularItem
                key={item.id}
                item={item}
                hasLiked={!!likeObj}
                onPress={() =>
                  navigation.navigate("PostDetailsScreen", { item: item })
                }
                handleLike={() => {
                  handleLike(!!likeObj, item.uuid, likeObj?.uuid);
                }}
              />
            );
          }}
          onEndReached={() => {
            console.log("YOOOO");
          }}
          onEndReachedThreshold={1}
        />
      </VStack>
    </ScreenBox>
  );
};

export default HomeScreen;
