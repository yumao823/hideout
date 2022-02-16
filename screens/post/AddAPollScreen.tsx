import { FormikErrors, FormikTouched, useFormik } from "formik";
import * as Yup from "yup";
import { Box, HStack, theme, useToast, VStack, Image } from "native-base";
import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

import { PrimaryButton } from "../../components/base/Buttons";
import { TextArea } from "../../components/base/TextArea";
import {
  HelperText,
  LabelText,
  ParagraphText,
  TitleText,
} from "../../components/base/Texts";
import { ScreenBox } from "../../components/ScreenBox";
import { TouchableOpacity } from "react-native-gesture-handler";
import { definitions } from "../../types/supabase";
import { Input } from "../../components/base/Input";
import { supabase } from "../../supabase";
import { useAuth } from "../../stores/useAuth";
import { first } from "lodash";
import { FontAwesome } from "@expo/vector-icons";

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
        mt="1"
        p="2"
        borderRadius="4"
        bg="coolGray.700"
        alignItems="center"
      >
        <TitleText mr="2">@</TitleText>
        <HelperText fontSize="12">
          {brands?.length > 0
            ? brands?.map((brand) => brand?.name).join(", ")
            : "Tap here to mention brands and get answers faster"}
        </HelperText>
      </HStack>
    </TouchableOpacity>
  );
}

interface Choice {
  text: string;
}

const AnswerChoice = ({
  choice,
  index,
  onChangeText,
  onPressDelete,
}: {
  choice: string;
  index: number;
  onChangeText: (text: string) => void;
  onPressDelete: () => void;
}) => {
  return (
    <HStack justifyContent="space-between" alignItems="center" width="full">
      <FontAwesome
        name="minus-circle"
        size={20}
        color={theme.colors.coolGray[700]}
        mr="4"
        onPress={onPressDelete}
      />
      <Input
        placeholder="Answer choice"
        style={{
          width: "90%",
        }}
        onChangeText={onChangeText}
        value={choice}
      />
    </HStack>
  );
};

function PollBox({
  choices,
  setChoices,
  touches,
  errors,
}: {
  choices: Choice[];
  setChoices: (next: Choice[]) => void;
  touches: FormikTouched<{ text: string }>[] | undefined;
  errors: string | string[] | FormikErrors<{ text: string }>[] | undefined;
}) {
  return (
    <VStack my="8" justifyContent="center" alignItems="center" space="4">
      {choices.map((choice, i) => {
        return (
          <>
            <AnswerChoice
              key={i}
              choice={choice.text}
              index={i}
              onChangeText={(text) => {
                const next = choices.slice();
                next[i].text = text;
                setChoices(next);
              }}
              onPressDelete={() => {
                if (choices.length === 2) {
                  return;
                }

                setChoices(choices.filter((choice, j) => j !== i));
              }}
            />
            {touches && touches[i] && errors && errors[i] && (
              <HelperText mt="1" color="red.400">
                {errors[i]?.text}
              </HelperText>
            )}
          </>
        );
      })}
      <TouchableOpacity
        onPress={() => {
          if (choices.length > 5) {
            return;
          }

          setChoices([...choices, { text: "" }]);
        }}
      >
        <HStack
          width="200"
          py="3"
          bg="coolGray.700"
          flexDirection="row"
          justifyContent="space-between"
          px="3"
          alignItems="center"
          borderRadius="3"
        >
          <FontAwesome
            name="plus"
            size={15}
            color={theme.colors.coolGray[400]}
          />
          <ParagraphText color="coolGray.400" fontFamily="Karla_700Bold">
            Add answer choice{" "}
          </ParagraphText>
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
}

export default function AddAPollScreen({ route, navigation }) {
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
      description: "",
      image: null,
      choices: [{ text: "" }, { text: "" }, { text: "" }],
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(4, "Must be more than four characters long")
        .max(150, "Must be less than 150 characters long")
        .required("This is field required"),
      description: Yup.string()
        .min(20, "Must be more than 20 characters long")
        .max(1000, "Must be less than 1000 characters long")
        .required("This is field required"),
      choices: Yup.array().of(
        Yup.object().shape({
          text: Yup.string().required(
            "All poll options must have text or be removed"
          ),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        let imageFilePath = null;

        if (values?.image) {
          let localUri = values.image;
          let filename = localUri.split("/").pop();
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image`;
          let formData = new FormData();

          formData.append("photo", { uri: localUri, name: filename, type });

          const { data, error } = await supabase.storage
            .from("images")
            .upload(filename, formData, {
              cacheControl: "3600",
              upsert: false,
            });

          if (data) {
            imageFilePath = data?.Key;
          }
        }

        const { data, error } = await supabase.from("posts").insert([
          {
            type,
            description: values.description,
            topic: topic?.uuid,
            title: values.title,
            user: auth?.user?.id,
            image: imageFilePath ? imageFilePath : "",
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

        await supabase.from("poll_options").insert(
          values.choices.map((choice) => {
            return { post: postUuid, text: choice.text };
          })
        );

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

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      formik.setFieldValue("image", result.uri);
    }
  };

  const handlePressCompanyBox = () => {
    navigation.navigate("AddBrandsScreen", {
      ...route?.params,
      title: formik.values.title,
      description: formik.values.description,
    });
  };

  console.log(formik.touched.choices);
  console.log(formik.errors.choices);

  return (
    <ScreenBox scrollable>
      <Box justifyContent="space-between" flexDirection="column" flex={1}>
        <VStack space="sm">
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
            <LabelText>Description</LabelText>
            <TextArea
              numberOfLines={18}
              height="100"
              placeholder="Keep it relevant. If the community flags your post for going off topic it will be invisible to the community"
              onChangeText={formik.handleChange("description")}
              onBlur={formik.handleBlur("description")}
              value={formik.values.description}
            />
            <HelperText alignSelf="flex-start">
              Limit to 1000 characters
            </HelperText>
            {formik.touched.description && formik.errors.description && (
              <HelperText mt="1" color="red.400">
                {formik.errors.description}
              </HelperText>
            )}
          </Box>
          <PollBox
            choices={formik.values.choices}
            setChoices={(next) => formik.setFieldValue("choices", next)}
            touches={formik.touched.choices}
            errors={formik.errors.choices}
          />

          <SelectCompanyBox onPress={handlePressCompanyBox} brands={brands} />
          {!formik.values?.image && (
            <TouchableOpacity onPress={pickImage}>
              <Box
                mt="2"
                borderColor="coolGray.600"
                borderWidth="1"
                justifyContent="center"
                alignItems="center"
                width="70"
                height="70"
                borderRadius="4"
                bgColor="coolGray.700"
              >
                <FontAwesome
                  size={18}
                  name="camera"
                  color={theme.colors.coolGray[500]}
                />
              </Box>
            </TouchableOpacity>
          )}
          {formik?.values?.image && (
            <Box position="relative" alignSelf="flex-start" mt="2">
              <Image
                source={{ uri: formik?.values?.image }}
                width="70"
                height="70"
                borderRadius="4"
                alt="image"
              />
              <Box
                top="-5"
                right="-5"
                position="absolute"
                bg="coolGray.100"
                width="5"
                height="5"
                justifyContent="center"
                alignItems="center"
                borderRadius="full"
              >
                <FontAwesome
                  size={15}
                  name="close"
                  onPress={() => formik.setFieldValue("image", null)}
                  color={theme.colors.coolGray[500]}
                />
              </Box>
            </Box>
          )}
        </VStack>
        <PrimaryButton
          mb="5"
          mt="12"
          onPress={formik.handleSubmit}
          isLoading={formik.isSubmitting}
        >
          Post to Community
        </PrimaryButton>
      </Box>
    </ScreenBox>
  );
}
