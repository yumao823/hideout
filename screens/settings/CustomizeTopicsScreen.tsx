import {
  Box,
  Button,
  Heading,
  HStack,
  theme,
  useToast,
  VStack,
} from "native-base";
import * as React from "react";
import { TopicsButton } from "../../components/TopicsButton";
import { supabase } from "../../supabase";
import { useNavigation } from "@react-navigation/native";
import { xor } from "lodash";
import { PlusButton, PrimaryButton } from "../../components/base/Buttons";
import { HeroHeading } from "../../components/base/Headings";
import { ParagraphText } from "../../components/base/Texts";
import { ScreenBox } from "../../components/ScreenBox";
import { useAuth } from "../../stores/useAuth";
import { definitions } from "../../types/supabase";

export default function CustomizeTopicsScreen() {
  const [topics, setTopics] = React.useState<definitions["topics"][]>([]);
  const [topicIds, setTopicIds] = React.useState<string[]>([]);
  const [userTopicIds, setUserTopicIds] = React.useState<string[]>([]);

  const toast = useToast();
  const auth = useAuth();
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const user_topics = await supabase
        .from<definitions["user_topics"]>("user_topics")
        .select()
        .eq("user", auth?.user?.id);
      const res = await supabase.from<definitions["topics"]>("topics").select();

      setTopics(res.data);

      if (user_topics?.data) {
        const nextTopicIds: string[] = user_topics.data?.map(
          (topic) => topic?.topic
        );
        setTopicIds(nextTopicIds);
        setUserTopicIds(nextTopicIds);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const submitTopics = async () => {
    try {
      const topicsToSave = topicIds
        .filter((id) => !userTopicIds.includes(id))
        .map((id) => {
          return { user: auth?.user?.id, topic: id };
        });

      const topicsToDelete = userTopicIds
        .filter((id) => !topicIds.includes(id))
        .map((id) => {
          return id;
        });

      const { error } = await supabase.from("user_topics").insert(topicsToSave);

      await Promise.all(
        topicsToDelete.map(async (id) => {
          return await supabase
            .from("user_topics")
            .delete()
            .match({ user: auth?.user?.id, topic: id });
        })
      );

      if (error) {
        toast.show({
          title: "Error saving topics",
          status: "warning",
          placement: "top",
          description: error.message,
        });
      }

      toast.show({
        title: "Successfully updated topics",
        status: "success",
        placement: "top",
      });

      // auth?.fetchUser(supabase.auth.user()?.id);

      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScreenBox>
      <VStack justifyContent="space-between" flex={1} pb="6">
        <Box>
          <ParagraphText mt="1">
            Choose three or more to get the most out of hideout{" "}
          </ParagraphText>

          <HStack mt="5" flexWrap="wrap">
            {topics?.map((topic) => {
              return (
                <PlusButton
                  key={topic?.uuid}
                  active={topicIds.includes(topic?.uuid)}
                  text={topic?.name}
                  onPress={() => {
                    setTopicIds(xor(topicIds, [topic?.uuid]));
                  }}
                />
              );
            })}
          </HStack>
        </Box>
        <PrimaryButton onPress={submitTopics} isDisabled={!topicIds.length}>
          Update my Topics
        </PrimaryButton>
      </VStack>
    </ScreenBox>
  );
}
