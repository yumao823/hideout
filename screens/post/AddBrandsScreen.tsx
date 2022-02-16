import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { xor } from "lodash";
import { HStack, Pressable, ScrollView, theme } from "native-base";
import * as React from "react";
import { PrimaryButton } from "../../components/base/Buttons";
import { ParagraphText } from "../../components/base/Texts";
import { ScreenBox } from "../../components/ScreenBox";
import { supabase } from "../../supabase";
import { definitions } from "../../types/supabase";

export function BrandItem(props: {
  onPress: () => void;
  name?: string;
  active: boolean;
}) {
  return (
    <Pressable onPress={props.onPress}>
      <HStack alignItems="center" mb="7" justifyContent="space-between">
        <ParagraphText
          color={props.active ? theme.colors.yellow[400] : theme.colors.white}
        >
          {props.name}
        </ParagraphText>
        <FontAwesome
          name={props.active ? "check-circle" : "plus"}
          size={18}
          color={props.active ? theme.colors.yellow[400] : theme.colors.white}
        />
      </HStack>
    </Pressable>
  );
}

export default function AddBrandsScreen({ route, navigation }) {
  const [brands, setBrands] = React.useState<definitions["brands"][]>([]);
  const [brandIds, setBrandIds] = React.useState<string[]>([]);

  const { type } = route.params;

  const fetchData = async () => {
    try {
      const res = await supabase.from<definitions["brands"]>("brands").select();
      setBrands(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    switch (type) {
      case "poll":
        navigation.navigate("AddAPollScreen", {
          ...route?.params,
          brands: brands.filter((brand) => brandIds.includes(brand.uuid)),
        });
        break;
      case "post":
        navigation.navigate("AddAPostScreen", {
          ...route?.params,
          brands: brands.filter((brand) => brandIds.includes(brand.uuid)),
        });
        break;
      case "url":
        navigation.navigate("AddAUrlScreen", {
          ...route?.params,
          brands: brands.filter((brand) => brandIds.includes(brand.uuid)),
        });
        break;
      default:
        navigation.navigate("AddAPostScreen", {
          ...route?.params,
          brands: brands.filter((brand) => brandIds.includes(brand.uuid)),
        });
    }
  };

  return (
    <ScreenBox>
      <ScrollView>
        {brands?.map((brand) => {
          return (
            <BrandItem
              name={brand.name}
              key={brand.uuid}
              active={brandIds.includes(brand.uuid)}
              onPress={() => {
                setBrandIds(xor(brandIds, [brand.uuid]));
              }}
            />
          );
        })}
      </ScrollView>
      {brandIds.length ? (
        <PrimaryButton mb="5" onPress={handleSave}>
          Save
        </PrimaryButton>
      ) : null}
    </ScreenBox>
  );
}
