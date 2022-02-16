import * as React from "react";
import { FlatList, VStack } from "native-base";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import * as Haptics from "expo-haptics";
import { supabase } from "../../supabase";
import { ScreenBox } from "../../components/ScreenBox";
import { PopularItem } from "../../components/PopularItem";
import { useAuth } from "../../stores/useAuth";
import { definitions } from "../../types/supabase";

const FETCH_POSTS = `
post(
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
)
`;

export default function BookmarksScreen() {
  const [posts, setPosts] = React.useState<definitions["posts"][]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const auth = useAuth();

  async function fetchData() {
    const postData = await supabase
      .from("bookmarks")
      .select(FETCH_POSTS)
      .match({ user: auth?.user?.id });

    console.log(postData);

    if (postData.data) {
      setPosts(postData.data.map((item) => item.post));
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
      <VStack space={2} h="100%">
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
}
