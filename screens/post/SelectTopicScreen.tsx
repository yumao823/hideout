import { FontAwesome } from "@expo/vector-icons";
import { HStack, Pressable, ScrollView, Spacer, theme } from "native-base";
import * as React from "react";
import { height } from "styled-system";
import { TitleHeading } from "../../components/base/Headings";
import { ParagraphText } from "../../components/base/Texts";
import { ScreenBox } from "../../components/ScreenBox";
import { supabase } from "../../supabase";
import { definitions } from "../../types/supabase";

export function TopicItem(props: { onPress: () => void; name: string }) {
  return (
    <Pressable onPress={props.onPress}>
      <HStack alignItems="flex-start" mb="7">
        <ParagraphText style={{ height: 30 }}>{props.name}</ParagraphText>
        <Spacer />
        <FontAwesome name="angle-right" size={20} color={theme.colors.white} />
      </HStack>
    </Pressable>
  );
}

export default function SelectTopicScreen({ route, navigation }) {
  const [topics, setTopics] = React.useState<definitions["topics"][]>([]);

  const { type } = route.params;

  const fetchData = async () => {
    try {
      const res = await supabase.from<definitions["topics"]>("topics").select();
      setTopics(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScreenBox>
      <TitleHeading mb="6">Select a topic for your post</TitleHeading>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {topics?.map((topic) => {
          return (
            <TopicItem
              name={topic.name}
              key={topic.uuid}
              onPress={() => {
                switch (type) {
                  case "poll":
                    navigation.navigate("AddAPollScreen", {
                      type,
                      topic,
                    });
                    break;
                  case "post":
                    navigation.navigate("AddAPostScreen", {
                      type,
                      topic,
                    });
                    break;
                  case "url":
                    navigation.navigate("AddAUrlScreen", {
                      type,
                      topic,
                    });
                    break;
                  default:
                    navigation.navigate("AddAPostScreen", {
                      type,
                      topic,
                    });
                }
              }}
            />
          );
        })}
      </ScrollView>
    </ScreenBox>
  );
}
