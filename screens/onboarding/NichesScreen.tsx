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

export default function NichesScreen() {
  const [niches, setNiches] = React.useState<definitions["niches"][]>([]);
  const [nicheIds, setNicheIds] = React.useState<string[]>([]);

  const navigation = useNavigation();
  const toast = useToast();
  const auth = useAuth();

  const fetchData = async () => {
    try {
      const res = await supabase.from<definitions["niches"]>("niches").select();
      setNiches(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const submit = async () => {
    try {
      const nichesToSave = nicheIds.map((id) => {
        return { user: auth?.user?.id, niche: id };
      });

      const { error } = await supabase.from("user_niches").insert(nichesToSave);

      if (error) {
        toast.show({
          title: "Error saving niches",
          status: "warning",
          placement: "top",
          description: error.message,
        });

        return;
      }
      navigation.navigate("TopicsScreen");
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
          <HeroHeading>What niches are you interested in?</HeroHeading>
          <ParagraphText mt="1">
            This will help us customize your feed.{" "}
          </ParagraphText>

          <HStack mt="5" flexWrap="wrap">
            {niches?.map((niche) => {
              return (
                <PlusButton
                  key={niche?.uuid}
                  active={nicheIds.includes(niche?.uuid)}
                  text={niche?.name}
                  onPress={() => {
                    setNicheIds(xor(nicheIds, [niche?.uuid]));
                  }}
                />
              );
            })}
          </HStack>
        </Box>
        <PrimaryButton onPress={submit} isDisabled={!nicheIds.length}>
          Continue
        </PrimaryButton>
      </VStack>
    </ScreenBox>
  );
}
