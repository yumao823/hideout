import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, HStack, useToast, VStack } from "native-base";
import * as React from "react";

import { PrimaryButton } from "../../components/base/Buttons";
import { TextArea } from "../../components/base/TextArea";
import { HelperText, LabelText, TitleText } from "../../components/base/Texts";
import { ScreenBox } from "../../components/ScreenBox";
import { TouchableOpacity } from "react-native-gesture-handler";
import { definitions } from "../../types/supabase";
import { Input } from "../../components/base/Input";
import { supabase } from "../../supabase";
import { useAuth } from "../../stores/useAuth";
import { first } from "lodash";

function SelectCompanyBox({
  onPress,
  brands,
}: {
  onPress: () => void;
  brands: definitions["brands"][];
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        borderColor="coolGray.600"
        borderWidth="1"
        mt="4"
        p="2"
        borderRadius="4"
        bg="coolGray.700"
        alignItems="center"
      >
        <TitleText mr="2">@</TitleText>
        <HelperText>
          {brands?.length > 0
            ? brands?.map((brand) => brand?.name).join(", ")
            : "Tap here to mention brands and get answers faster"}
        </HelperText>
      </HStack>
    </TouchableOpacity>
  );
}

export default function AddAUrlScreen({ route, navigation }) {
  const {
    type,
    topic,
    brands,
  }: {
    topic: definitions["topics"];
    type: string;
    brands: definitions["brands"][];
  } = route?.params;

  const auth = useAuth();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      title: "",
      url: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(4, "Must be more than four characters long")
        .max(150, "Must be less than 50 characters long")
        .required("This is field required"),
      url: Yup.string()
        .url("Please enter a valid url")
        .required("This is field required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data, error } = await supabase.from("posts").insert([
          {
            type,
            url: values.url,
            topic: topic?.uuid,
            title: values.title,
            user: auth?.user?.id,
          },
        ]);

        if (error) {
          toast.show({
            title: "Error saving post",
            status: "warning",
            placement: "top",
            description: error.message,
          });

          return;
        }

        const postUuid = first(data)?.uuid;
        console.log(postUuid);

        if (brands?.length) {
          await supabase.from("posts_related_brands").insert(
            brands.map((brand) => {
              return { brand: brand?.uuid, post: postUuid };
            })
          );
        }

        toast.show({
          title: "Success",
          status: "success",
          placement: "top",
          description: "Your post was succesfully added to the board",
        });

        navigation.navigate("BottomTab");
      } catch (e) {
        console.log(e);
      }
    },
  });

  const handlePressCompanyBox = () => {
    navigation.navigate("AddBrandsScreen", {
      ...route?.params,
      title: formik.values.title,
      url: formik.values.url,
    });
  };

  return (
    <ScreenBox>
      <Box justifyContent="space-between" flexDirection="column" flex={1}>
        <VStack space="4">
          <Box>
            <LabelText>Title</LabelText>
            <Input
              placeholder="Has anyone seen that new video of Mr. Beast...."
              onChangeText={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
              value={formik.values.title}
            />
            <HelperText alignSelf="flex-start">
              Limit to 50 characters
            </HelperText>
            {formik.touched.title && formik.errors.title && (
              <HelperText mt="1" color="red.400">
                {formik.errors.title}
              </HelperText>
            )}
          </Box>

          <Box>
            <LabelText>Url Link</LabelText>

            <TextArea
              numberOfLines={8}
              placeholder="E.g. https://twitter.com/Akademiks/status/1450626876230144001?s=20"
              onChangeText={formik.handleChange("url")}
              onBlur={formik.handleBlur("url")}
              value={formik.values.url}
            />
            <HelperText alignSelf="flex-start">
              Add a url and select continue.
            </HelperText>
            {formik.touched.url && formik.errors.url && (
              <HelperText mt="1" color="red.400">
                {formik.errors.url}
              </HelperText>
            )}
            <SelectCompanyBox onPress={handlePressCompanyBox} brands={brands} />
          </Box>
        </VStack>
        <PrimaryButton mb="5" onPress={formik.handleSubmit}>
          Post to Community
        </PrimaryButton>
      </Box>
    </ScreenBox>
  );
}
