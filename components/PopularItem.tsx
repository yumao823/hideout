import * as React from "react";
import { Box, Image, Flex, Spacer, theme } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { ParagraphText, HelperText, TitleText, LabelText } from "./base/Texts";
import { definitions } from "../types/supabase";
import { first } from "lodash";
import { TouchableOpacity } from "react-native";

export function PopularItem({
  item,
  onPress,
  hasLiked,
  handleLike,
}: {
  item: definitions["posts"];
  onPress: () => void;
  hasLiked: boolean;
  handleLike: () => void;
}) {
  return (
    <Box mb={10}>
      <Flex direction="row" mb="1" h="6">
        {item.type === "poll" && (
          <Box
            borderWidth={1}
            borderRadius="full"
            borderColor="coolGray.500"
            bg="coolGray.700"
            paddingX={3}
            marginRight={3}
            h="6"
          >
            <ParagraphText color={theme.colors.yellow[400]}>Poll</ParagraphText>
          </Box>
        )}
        <ParagraphText>{item?.topic?.name}</ParagraphText>
      </Flex>
      <TitleText onPress={onPress}>{item.title}</TitleText>
      <HelperText mb={2}>{item.description}</HelperText>
      {item.type === "poll" && (
        <Flex
          direction="row"
          bgColor={theme.colors.coolGray[700]}
          borderRadius={6}
          px={3}
          py={1}
          my={2}
        >
          <Image
            alt="image"
            size={19}
            source={require("../assets/images/participant.png")}
          />
          <LabelText color={theme.colors.yellow[400]} ml={5}>
            {first(item?.participants)?.count} PARTICIPANTS
          </LabelText>
          <Spacer />
          <FontAwesome
            name="angle-right"
            size={20}
            color={theme.colors.white}
          />
        </Flex>
      )}
      <Flex
        direction="row"
        mt={1}
        h="6"
        alignContent="center"
        justifyContent="center"
      >
        <FontAwesome color={theme.colors.coolGray[500]} name="eye" size={20} />
        <LabelText mx={2}>{item?.views || 0}</LabelText>
        <TouchableOpacity onPress={handleLike} style={{ flexDirection: "row" }}>
          <FontAwesome
            color={
              hasLiked ? theme.colors.red[400] : theme.colors.coolGray[500]
            }
            name={hasLiked ? "heart" : "heart-o"}
            size={18}
          />
          <LabelText
            color={
              hasLiked ? theme.colors.red[400] : theme.colors.coolGray[500]
            }
            mx={2}
          >
            {item?.likes?.length || 0}
          </LabelText>
        </TouchableOpacity>
        <FontAwesome
          color={theme.colors.coolGray[500]}
          name="comment-o"
          size={18}
        />
        <LabelText ml={2}>{first(item?.commentCount)?.count || 0}</LabelText>
        <Spacer />
        <LabelText>{dayjs(item?.created_at).fromNow()}</LabelText>
      </Flex>
    </Box>
  );
}
