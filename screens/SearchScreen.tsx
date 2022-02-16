import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { VStack } from "native-base";
import { filter, includes } from "ramda";
import { ScreenBox } from "../components/ScreenBox";
import { SearchInput } from "../components/base/Input";
import { TitleHeading, SubtitleHeading } from "../components/base/Headings";
import { SearchItem } from "../components/SearchItem";
import { supabase } from "../supabase";

const SearchScreen = () => {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState();
  const [searchHistory, setSearchHistory] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const navigation = useNavigation();

  const handleSearch = () => {
    setSearchHistory(true);
    const temp =
      search !== ""
        ? filter((e: any) => includes(search, e.name), searchResults)
        : search_items;
    setSearchResults(temp);
  };

  const fetchBrand = async () => {
    const res = await supabase.from("brands").select();
    setBrands(res.data);
    setSearchResults(res.data);
  };

  useEffect(() => {
    fetchBrand();
  }, []);

  return (
    <ScreenBox scrollable>
      <VStack space={5} h="100%">
        <SearchInput
          value={search}
          placeholder="Keywords, brands"
          fontSize={16}
          borderRadius={20}
          p={2}
          borderWidth={0}
          onChangeText={(e: string) => setSearch(e)}
          onEndEditing={handleSearch}
          onCancel={() => setSearch("")}
        />
        {!searchHistory && (
          <TitleHeading textAlign="center">No search history</TitleHeading>
        )}
        <SubtitleHeading>Popular Brands</SubtitleHeading>
        {brands?.map((item, index) => (
          <SearchItem
            key={`si-${index}`}
            name={item.name}
            image={item.thumbnail}
            onPress={() => {
              navigation.navigate("BrandReviews", {
                ...item,
              });
            }}
          />
        ))}
      </VStack>
    </ScreenBox>
  );
};

export default SearchScreen;
