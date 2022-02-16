import * as React from "react";
import { VStack, Box, HStack, useToast } from "native-base";
import { supabase } from "../../supabase";
import { ScreenBox } from "../../components/ScreenBox";
import { ParagraphText } from "../../components/base/Texts";
import { HeroHeading } from "../../components/base/Headings";
import { PrimaryButton, PlusButton } from "../../components/base/Buttons";
import { definitions } from "../../types/supabase";
import { xor } from "lodash";
import { useAuth } from "../../stores/useAuth";
import { useNavigation } from "@react-navigation/core";

export default function TopicsScreen() {
  const [topics, setTopics] = React.useState<definitions["topics"][]>([]);
  const [topicIds, setTopicIds] = React.useState<string[]>([]);

  const toast = useToast();
  const auth = useAuth();

  const fetchData = async () => {
    try {
      const res = await supabase.from<definitions["topics"]>("topics").select();
      setTopics(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const submit = async () => {
    try {
      const topicsToSave = topicIds.map((id) => {
        return { user: auth?.user?.id, topic: id };
      });

      const { error } = await supabase.from("user_topics").insert(topicsToSave);

      if (error) {
        toast.show({
          title: "Error saving topics",
          status: "warning",
          placement: "top",
          description: error.message,
        });
      }

      auth?.fetchUser(supabase.auth.user()?.id);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScreenBox>
      <VStack justifyContent="space-between" flex={1} pb="6" mt="12">
        <Box>
          <HeroHeading>Now pick some topics you want to follow</HeroHeading>
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
        <PrimaryButton onPress={submit} isDisabled={!topicIds.length}>
          Finish
        </PrimaryButton>
      </VStack>
    </ScreenBox>
  );
}
