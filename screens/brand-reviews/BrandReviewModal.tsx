import React from "react";
import { Box, Checkbox, Flex, Image, useToast, VStack } from "native-base";
import * as Yup from "yup";
import { useFormik } from "formik";

import Rating from "../../components/base/Rating";
import { TitleHeading } from "../../components/base/Headings";
import {
  LabelText,
  HelperText,
  ParagraphText,
} from "../../components/base/Texts";
import { PrimaryButton } from "../../components/base/Buttons";
import { InputGroup } from "../../components/base/Input";
import { ScreenBox } from "../../components/ScreenBox";
import { useAuth } from "../../stores/useAuth";
import { supabase } from "../../supabase";

console.disableYellowBox = true;
const PostReviewModal = ({ navigation, route }) => {
  const auth = useAuth();
  const toast = useToast();

  const user_uuid = auth?.user?.id;
  const brand_uuid = route.params?.brand_uuid;
  const brand_name = route.params?.brand_name;
  const brand_thumbnail = route.params?.brand_thumbnail;

  const formik = useFormik({
    initialValues: {
      overrall_rating: 0,
      compensation_rating: 0,
      easy_to_work_with_rating: 0,
      responsive_rating: 0,
      title: "",
      pros: "",
      cons: "",
      compensation: -1,
      equity: "",
      received_free_product: false,
      number_of_posts: 0,
      number_of_followers: 0,
    },
    validationSchema: Yup.object().shape({
      overrall_rating: Yup.number()
        .min(1, "Overall rating is required")
        .required("Overall rating required"),
      compensation_rating: Yup.number()
        .min(1, "Compensation rating is required")
        .required("Compensation rating required"),
      easy_to_work_with_rating: Yup.number()
        .min(1, "Ease to work with rating is required")
        .required("Ease to work with rating required"),
      responsive_rating: Yup.number()
        .min(1, "Responsive rating is required")
        .required("Responsive rating required"),
      title: Yup.string()
        .min(4, "Must be more than four characters long")
        .max(50, "Must be less than 50 characters long")
        .required("Title field is required"),
      pros: Yup.string()
        .min(4, "Must be more than four characters long")
        .max(1000, "Must be less than 1000 characters long")
        .required("Pros field is required"),
      cons: Yup.string()
        .min(4, "Must be more than four characters long")
        .max(1000, "Must be less than 1000 characters long")
        .required("Cons field is required"),
      compensation: Yup.number()
        .min(0, "Compensation field is required")
        .required("Compensation field is required"),
      equity: Yup.string(),
      received_free_product: Yup.boolean(),
      number_of_posts: Yup.number()
        .min(1, "Posts field is required")
        .required("Posts field is required"),
      number_of_followers: Yup.number()
        .min(1, "Followers field is required")
        .required("Followers field is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await supabase.from("reviews").insert([
          {
            brand: brand_uuid,
            user: user_uuid,
            ...values,
          },
        ]);

        if (res.error) {
          console.log(res.error);
          toast.show({
            title: "Error saving review",
            status: "warning",
            placement: "top",
            description: res.error.message,
          });
        }

        toast.show({
          title: "Success",
          status: "success",
          placement: "top",
          description: "Your review was succesfully added to the community",
        });
        navigation.goBack();
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <ScreenBox scrollable backgroundColor="coolGray.800" minHeight="100%" p={2}>
      <Flex flexDirection="row" mb={8} alignItems="center">
        <Image
          size={34}
          mr={2}
          source={{ uri: brand_thumbnail }}
          alt={brand_name}
        />
        <Box width="80%" ml={4}>
          <LabelText>Brand Name</LabelText>
          <Box
            p={2}
            bg="coolGray.700"
            borderRadius="4"
            borderColor="coolGray.500"
            borderWidth=".5"
          >
            <LabelText>{brand_name}</LabelText>
          </Box>
          <HelperText>Press here if you want to change brand</HelperText>
        </Box>
      </Flex>
      <VStack space={3} mb="4">
        <TitleHeading alignSelf="center" mb={3}>
          Rate this brand
        </TitleHeading>
        <Rating
          rating={formik.values.overrall_rating}
          size={30}
          touchable
          title="Overall Rating"
          onRatingChange={(e) => formik.setFieldValue("overrall_rating", e)}
          hasErrors={
            !!(formik.touched.overrall_rating && formik.errors.overrall_rating)
          }
          errorText={formik.errors.overrall_rating}
        />
        <Rating
          touchable
          size={24}
          rating={formik.values.compensation_rating}
          title="Compensation / Benefits"
          onRatingChange={(e) => formik.setFieldValue("compensation_rating", e)}
          hasErrors={
            !!(
              formik.touched.compensation_rating &&
              formik.errors.compensation_rating
            )
          }
          errorText={formik.errors.compensation_rating}
        />
        <Rating
          touchable
          rating={formik.values.easy_to_work_with_rating}
          size={24}
          title="Easy to work with you"
          onRatingChange={(e) =>
            formik.setFieldValue("easy_to_work_with_rating", e)
          }
          hasErrors={
            !!(
              formik.touched.easy_to_work_with_rating &&
              formik.errors.easy_to_work_with_rating
            )
          }
          errorText={formik.errors.easy_to_work_with_rating}
        />
        <Rating
          touchable
          rating={formik.values.responsive_rating}
          size={24}
          title="Responsive"
          onRatingChange={(e) => formik.setFieldValue("responsive_rating", e)}
          hasErrors={
            !!(
              formik.touched.responsive_rating &&
              formik.errors.responsive_rating
            )
          }
          errorText={formik.errors.responsive_rating}
        />
        <InputGroup
          label="Review Summary"
          value={formik.values.title}
          placeholder="E.g. Really easy to work with"
          onChange={(e) => formik.setFieldValue("title", e)}
          help="This will be the first thing people see when reading your review"
          hasErrors={!!(formik.touched.title && formik.errors.title)}
          errorText={formik.errors.title}
        />
        <InputGroup
          label="Pros"
          value={formik.values.pros}
          placeholder={`Share your best reasons to work with ${brand_name}`}
          textarea
          onChange={(e) => formik.setFieldValue("pros", e)}
          help="Limit to 250 characters"
          hasErrors={!!(formik.touched.pros && formik.errors.pros)}
          errorText={formik.errors.pros}
        />
        <InputGroup
          label="Cons"
          value={formik.values.cons}
          placeholder={`Share downsides working with ${brand_name}`}
          textarea
          onChange={(e) => formik.setFieldValue("cons", e)}
          help="Limit to 250 characters"
          hasErrors={!!(formik.touched.cons && formik.errors.cons)}
          errorText={formik.errors.cons}
        />
        <Box />
        <InputGroup
          label="Compensation"
          value={formik.values.compensation}
          placeholder="$ 1,000"
          keyboardType="numeric"
          onChange={(e) => formik.setFieldValue("compensation", e)}
          help="How much were you paid for creating and posting a single piece of content"
          hasErrors={
            !!(formik.touched.compensation && formik.errors.compensation)
          }
          errorText={formik.errors.compensation}
        />
        <InputGroup
          label="Equity"
          value={formik.values.equity}
          placeholder="E.g. 10 shares of stock"
          onChange={(e) => formik.setFieldValue("equity", e)}
          help="How much equity were you paid for creating and posting a single piece of content"
          hasErrors={!!(formik.touched.equity && formik.errors.equity)}
          errorText={formik.errors.equity}
        />
        <Box>
          <LabelText mb="2">Did you receive any free product?</LabelText>
          <Checkbox
            alignSelf="flex-start"
            value={formik.values.received_free_product}
            aria-label="checkbox"
            mb={3}
            onChange={(e) => formik.setFieldValue("received_free_product", e)}
          />
        </Box>
        <InputGroup
          label="Number of Posts"
          value={formik.values.number_of_posts}
          keyboardType="numeric"
          placeholder="5"
          onChange={(e) => formik.setFieldValue("number_of_posts", e)}
          help="How many posts did you do"
          hasErrors={
            !!(formik.touched.number_of_posts && formik.errors.number_of_posts)
          }
          errorText={formik.errors.number_of_posts}
        />
        <InputGroup
          label="Followers"
          value={formik.values.number_of_followers}
          keyboardType="numeric"
          placeholder="1000"
          onChange={(e) => formik.setFieldValue("number_of_followers", e)}
          help="At the time of this collaboration, how many followers did you have on the platform where it took place?"
          hasErrors={
            !!(
              formik.touched.number_of_followers &&
              formik.errors.number_of_followers
            )
          }
          errorText={formik.errors.number_of_followers}
        />
      </VStack>
      <ParagraphText mt="8">
        Your anonymous reviews willl help others choose the right fit for their
        next collaboration.
      </ParagraphText>
      <HelperText>
        Please follow our Review guildlines. We do not publish a review if it
        violates our review guidelines.
      </HelperText>
      <PrimaryButton width="100%" mt="6" onPress={formik.handleSubmit}>
        Post Review
      </PrimaryButton>
    </ScreenBox>
  );
};

export default PostReviewModal;
