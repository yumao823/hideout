import React, { useState } from "react";
import { VStack, Spacer, useToast } from "native-base";
import { useFormik } from "formik";
import * as Yup from "yup";

import { ScreenBox } from "../../components/ScreenBox";
import { InputGroup } from "../../components/base/Input";
import { PrimaryButton } from "../../components/base/Buttons";
import { useAuth } from "../../stores/useAuth";
import { supabase } from "../../supabase";
import { first } from "lodash";
import { useNavigation } from "@react-navigation/core";

export default function EditProfileScreen() {
  const auth = useAuth();
  const toast = useToast();
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: {
      screenName: auth?.user?.screen_name,
      location: auth?.user?.location || "",
      years: auth?.user?.years_of_exp || 0,
      bio: auth?.user?.bio || "",
    },
    validationSchema: Yup.object().shape({
      screenName: Yup.string()
        .min(5, "Must be more than five characters long")
        .max(20, "Must be less than 20 characters long")
        .required("This is field required"),
      location: Yup.string()
        .min(5, "Must be more than 5 characters long")
        .max(1000, "Must be less than 1000 characters long"),
      years: Yup.number().min(1, "Years field is required"),
      bio: Yup.string()
        .min(4, "Must be more than four characters long")
        .max(1000, "Must be less than 1000 characters long"),
    }),
    onSubmit: async (values) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .update([
            {
              years_of_exp: values.years,
              bio: values.bio,
              screen_name: values.screenName,
              location: values.location,
            },
          ])
          .eq("uuid", auth?.user?.id);

        if (error) {
          toast.show({
            title: "Error saving post",
            status: "warning",
            placement: "top",
            description: error.message,
          });

          return;
        }

        toast.show({
          title: "Success",
          status: "success",
          placement: "top",
          description: "Your profile was succesfully updated",
        });

        auth?.fetchUser(auth?.user?.id);

        navigation.goBack();
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <ScreenBox scrollable>
      <VStack space={5} h="100%">
        <InputGroup
          label="Screen name"
          value={formik.values.screenName}
          placeholder="Screen name"
          onChange={(e) => formik.setFieldValue("screenName", e)}
          help="You can change your screen name once a day"
          hasErrors={!!(formik.touched.screenName && formik.errors.screenName)}
          errorText={formik.errors.screenName}
        />
        <InputGroup
          label="Location"
          value={formik.values.location}
          placeholder="San Francisco, CA"
          onChange={(e) => formik.setFieldValue("location", e)}
          help="Add your location so we can show nearby posts"
          hasErrors={!!(formik.touched.location && formik.errors.location)}
          errorText={formik.errors.location}
        />
        <InputGroup
          label="Years you've been creating"
          value={formik.values.years.toString()}
          keyboardType="numeric"
          placeholder="Years of Experiences"
          onChange={(e) => formik.setFieldValue("years", e)}
          help="Share with others how long you have been creating content"
          hasErrors={!!(formik.touched.years && formik.errors.years)}
          errorText={formik.errors.years}
        />
        <InputGroup
          label="Bio"
          value={formik.values.bio}
          textarea
          placeholder="Tell others about yourself"
          help="Tell others about yourself"
          onChange={(e) => formik.setFieldValue("bio", e)}
          hasErrors={!!(formik.touched.bio && formik.errors.bio)}
          errorText={formik.errors.bio}
        />
        <Spacer />
        <PrimaryButton onPress={formik.handleSubmit}>
          Update Profile
        </PrimaryButton>
      </VStack>
    </ScreenBox>
  );
}
