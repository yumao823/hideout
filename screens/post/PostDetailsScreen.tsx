import React, { useState, useEffect, useRef, createRef } from "react";
import {
  Box,
  Flex,
  HStack,
  Spacer,
  theme,
  useToast,
  VStack,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import KeyboardAccessory from "react-native-sticky-keyboard-accessory";

import {
  ParagraphText,
  HelperText,
  TitleText,
  LabelText,
} from "../../components/base/Texts";
import { SubtitleHeading } from "../../components/base/Headings";
import { ScreenBox } from "../../components/ScreenBox";
import { SearchItem } from "../../components/SearchItem";
import { useNavigation, useRoute } from "@react-navigation/core";
import { supabase } from "../../supabase";
import { definitions } from "../../types/supabase";
import dayjs from "dayjs";
import { first } from "lodash";
import * as Haptics from "expo-haptics";
import { TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../stores/useAuth";
import { ChatInput } from "../../components/base/Input";

const CommentItem = ({
  uuid,
  user_screen_name,
  text,
  date,
  likes,
  replies,
  onPress,
  fetchPost,
}: {
  uuid: string;
  user_screen_name?: string;
  text?: string;
  date?: string;
  likes?: [];
  replies?: {
    id: string;
    user_screen_name: string;
    text: string;
    date: number;
    likes?: [];
  }[];
  onPress: () => void;
  fetchPost: () => void;
}) => {
  const auth = useAuth();

  const likeObj = likes?.find((like) => like?.user?.uuid === auth?.user?.id);

  const hasLiked = !!likeObj;

  const handleLike = async (
    hasLiked: boolean,
    commentUuid?: string,
    likeUuid?: string
  ) => {
    if (!hasLiked) {
      await supabase
        .from("comment_likes")
        .insert([{ comment: commentUuid, user: auth?.user?.id }]);
    } else {
      await supabase.from("comment_likes").delete().eq("uuid", likeUuid);
    }

    fetchPost();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  return (
    <>
      <VStack space={2}>
        <HStack>
          <LabelText>{user_screen_name}</LabelText>
          {user_screen_name === auth?.user?.screen_name && (
            <LabelText color="red.400" ml="2" fontSize="xs">
              author
            </LabelText>
          )}
        </HStack>
        <LabelText>{text}</LabelText>
        <HStack alignItems="center" space={2} mb={3}>
          <LabelText mr={3}>{dayjs(date).fromNow()}</LabelText>
          <TouchableOpacity
            onPress={() => handleLike(hasLiked, uuid, likeObj?.uuid)}
            style={{ flexDirection: "row" }}
          >
            <FontAwesome
              color={
                hasLiked ? theme.colors.red[400] : theme.colors.coolGray[500]
              }
              name={hasLiked ? "heart" : "heart-o"}
              size={18}
            />
            <LabelText
              mr={3}
              ml={2}
              color={
                hasLiked ? theme.colors.red[400] : theme.colors.coolGray[500]
              }
            >
              {likes?.length}
            </LabelText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPress} style={{ flexDirection: "row" }}>
            <FontAwesome
              color={theme.colors.coolGray[500]}
              name="comment-o"
              size={18}
            />
            <LabelText ml={2}>Reply</LabelText>
          </TouchableOpacity>
        </HStack>
      </VStack>
      <Box width="full">
        {replies?.map((item, index) => {
          const likeReplyObj = item.likes?.find(
            (like) => like?.user?.uuid === auth?.user?.id
          );

          const hasLikedReply = !!likeReplyObj;

          return (
            <VStack
              key={`rp-${item.uuid}`}
              space={2}
              pl={5}
              my={3}
              borderColor="coolGray.900"
              borderTopWidth=".25"
            >
              <LabelText>{item.user_screen_name}</LabelText>
              <LabelText>{item.text}</LabelText>
              <HStack space={2}>
                <LabelText mr={3}>{dayjs(date).fromNow()}</LabelText>
                <TouchableOpacity
                  onPress={() =>
                    handleLike(hasLikedReply, item.uuid, likeReplyObj?.uuid)
                  }
                  style={{ flexDirection: "row" }}
                >
                  <FontAwesome
                    color={
                      hasLikedReply
                        ? theme.colors.red[400]
                        : theme.colors.coolGray[500]
                    }
                    name={hasLikedReply ? "heart" : "heart-o"}
                    size={18}
                  />
                  <LabelText
                    mr={3}
                    ml={2}
                    color={
                      hasLikedReply
                        ? theme.colors.red[400]
                        : theme.colors.coolGray[500]
                    }
                  >
                    {item.likes?.length}
                  </LabelText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPress}
                  style={{ flexDirection: "row" }}
                >
                  <FontAwesome
                    color={theme.colors.coolGray[500]}
                    name="comment-o"
                    size={18}
                  />
                  <LabelText ml={2}>Reply</LabelText>
                </TouchableOpacity>
              </HStack>
            </VStack>
          );
        })}
      </Box>
    </>
  );
};

const FETCH_POST = `
id,
uuid,
created_at,
title,
description,
url,
type,
views,
user (
  uuid,
  screen_name
),
participants:poll_answers(
  uuid,
  user (
    uuid,
    screen_name
  ),
  poll_options (
    uuid,
    text
  )
),
likes:post_likes(
  uuid,
  user (
    uuid,
    screen_name
  )
),
comments:comments(
  uuid,
  created_at,
  text,
  parent,
  user (
    uuid,
    screen_name
  ),
  likes:comment_likes(
    uuid,
    user (
      uuid,
      screen_name
    )
  )
),
topic (
  uuid,
  name
),
brands:posts_related_brands(
  uuid,
  brand (
    uuid,
    name,
    thumbnail
  )
)
`;

interface Comment {
  uuid?: string;
  created_at?: string;
  text?: string;
  parent?: string;
  user?: {
    uuid?: string;
    screen_name?: string;
  };
  likes: {
    uuid?: string;
    user?: {
      uuid?: string;
      screen_name?: string;
    };
  };
}

interface Like {
  uuid?: string;
  user?: {
    uuid?: string;
    screen_name?: string;
  };
}

interface Brand {
  uuid?: string;
  brand?: {
    uuid?: string;
    name?: string;
    thumbnail?: string;
  };
}

interface State {
  id: number;
  created_at?: string;
  title?: string;
  description?: string;
  type?: string;
  views?: number;
  uuid?: string;
  image?: string;
  url?: string;
  user: {
    uuid?: string;
    screen_name: string;
  };
  topic?: {
    uuid?: string;
    name?: string;
  };
  likes: Like[];
  comments: Comment[];
  brands: Brand[];
}

const PostDetailsScreen = () => {
  const chatRef = useRef();
  const { params } = useRoute();
  const navigation = useNavigation();
  const toast = useToast();
  const auth = useAuth();
  const [post, setPost] = React.useState<State>({});
  const [commentText, setCommentText] = React.useState("");
  const [bookmarks, setBookmarks] = React.useState<definitions["bookmarks"][]>(
    []
  );
  const [commentParent, setCommentParent] = useState<null | string>(null);

  const parents = {};
  post?.comments?.forEach((comment) => {
    if (!comment.parent) {
      parents[comment?.uuid] = { ...comment, replies: [] };
    }
  });
  post?.comments?.forEach((comment) => {
    if (comment.parent) {
      parents[comment?.parent].replies.push(comment);
    }
  });

  async function fetchPost() {
    const postData = await supabase
      .from("posts")
      .select(FETCH_POST)
      .match({ uuid: params.item.uuid });

    if (postData.data) {
      setPost(first(postData.data));
    }

    if (postData.error) {
      console.log(postData.error.message);
    }
  }

  async function fetchBookmarks() {
    const bookmarkData = await supabase
      .from("bookmarks")
      .select()
      .match({ user: auth?.user?.id });

    if (bookmarkData.data) {
      setBookmarks(bookmarkData.data);
    }

    if (bookmarkData.error) {
      console.log(bookmarkData.error.message);
    }
  }

  async function increaseViews() {
    await supabase.rpc("increment", {
      row_uuid: params?.item?.uuid,
    });
  }

  useEffect(() => {
    fetchPost();
    fetchBookmarks();
    increaseViews();
  }, []);

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

    fetchPost();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const likeObj = post?.likes?.find(
    (like) => like?.user?.uuid === auth?.user?.id
  );

  const hasLiked = !!likeObj;

  const hasBookmarked = !!bookmarks.find(
    (bookmark) => bookmark.post === post?.uuid
  );

  const handleBookmark = async () => {
    if (!hasBookmarked) {
      await supabase
        .from("bookmarks")
        .insert([{ post: post?.uuid, user: auth?.user?.id }]);
      toast.show({
        title: "Bookmarked under profile",
        placement: "bottom",
        isClosable: false,
      });
    } else {
      await supabase.from("bookmarks").delete().match({
        post: post?.uuid,
        user: auth?.user?.id,
      });
    }

    fetchBookmarks();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleOnPress = (id: string) => {
    chatRef?.current?.focus();
    setCommentParent(id);
  };

  return (
    <>
      <ScreenBox scrollable>
        <VStack space={7} pb="16">
          <VStack space={3}>
            <ParagraphText>{post?.topic?.name}</ParagraphText>
            <TitleText>{post?.title}</TitleText>
            <HStack space={3}>
              <ParagraphText>{post?.user?.screen_name}</ParagraphText>
              <ParagraphText>{dayjs(post?.created_at).fromNow()}</ParagraphText>
            </HStack>
            <HelperText mb={2}>{post?.description}</HelperText>
            <HStack alignItems="center" space={3}>
              <FontAwesome
                color={theme.colors.coolGray[500]}
                name="eye"
                size={20}
              />
              <LabelText mr={2}>{post?.views}</LabelText>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginRight: 2,
                  justifyContent: "space-between",
                }}
                onPress={() => {
                  handleLike(hasLiked, post.uuid, likeObj?.uuid);
                }}
              >
                <FontAwesome
                  color={
                    hasLiked
                      ? theme.colors.red[400]
                      : theme.colors.coolGray[500]
                  }
                  name={hasLiked ? "heart" : "heart-o"}
                  size={18}
                  mr={4}
                />
                <LabelText
                  color={
                    hasLiked
                      ? theme.colors.red[400]
                      : theme.colors.coolGray[500]
                  }
                  ml="3"
                >
                  {post?.likes?.length}
                </LabelText>
              </TouchableOpacity>
              <FontAwesome
                color={theme.colors.coolGray[500]}
                name="comment-o"
                size={18}
              />
              <LabelText>{post?.comments?.length}</LabelText>
              <Spacer />
              <TouchableOpacity onPress={handleBookmark}>
                <FontAwesome
                  color={theme.colors.yellow[500]}
                  name={hasBookmarked ? "bookmark" : "bookmark-o"}
                  size={22}
                />
              </TouchableOpacity>
            </HStack>
          </VStack>
          {post?.brands?.length > 0 && (
            <SubtitleHeading>Related Brands</SubtitleHeading>
          )}
          {post?.brands?.map((item, i) => (
            <SearchItem
              key={i + "related-brands"}
              name={item?.brand?.name}
              image={item?.brand?.thumbnail}
              onPress={() => {
                navigation.navigate("BrandReviews", {
                  uuid: item?.brand?.uuid,
                });
              }}
            />
          ))}
          <SubtitleHeading>Comments</SubtitleHeading>
          {Object.keys(parents)?.map((key) => (
            <CommentItem
              key={`ci-${parents[key]?.uuid}`}
              user_screen_name={parents[key]?.user?.screen_name}
              text={parents[key]?.text}
              date={parents[key]?.created_at}
              likes={parents[key]?.likes}
              replies={parents[key]?.replies}
              uuid={parents[key]?.uuid}
              onPress={() => handleOnPress(parents[key]?.uuid)}
              fetchPost={fetchPost}
            />
          ))}
        </VStack>
      </ScreenBox>
      <KeyboardAccessory>
        <Box
          backgroundColor="coolGray.800"
          py="4"
          px="2"
          borderTopColor="coolGray.700"
          borderTopWidth=".5"
        >
          <ChatInput
            placeholder="Add a comment"
            text={commentText}
            onLoseFocus={() => {
              setCommentParent(null);
            }}
            onPost={async () => {
              try {
                let res = await supabase.from("comments").insert([
                  {
                    text: commentText,
                    user: auth?.user?.id,
                    post: post?.uuid,
                    parent: commentParent,
                  },
                ]);
                fetchPost();
                setCommentText("");
                setCommentParent(null);
              } catch (e) {}
            }}
            onChangeText={(text) => setCommentText(text)}
            ref={chatRef}
          />
        </Box>
      </KeyboardAccessory>
    </>
  );
};

export default PostDetailsScreen;
