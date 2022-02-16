import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HStack, theme, VStack, Modal } from "native-base";
import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { useModal } from "../stores/useModal";
import { TitleHeading } from "./base/Headings";
import { ParagraphText } from "./base/Texts";

const screen = Dimensions.get("screen");

export const CreateAPostModal = () => {
  const modal = useModal();
  const navigation = useNavigation();

  const modal_selections = [
    { text: "Link / url", type: "url", icon: "paperclip" },
    { text: "Post", type: "post", icon: "edit" },
    { text: "Poll", type: "poll", icon: "list" },
  ];

  return (
    <Modal
      isOpen={modal?.open}
      onClose={() => modal?.setOpen(false)}
      justifyContent="flex-end"
      overlayVisible={true}
      backdropVisible={true}
      closeOnOverlayClick={true}
      animationPreset="slide"
    >
      <Modal.Content width={screen.width} bgColor="coolGray.800">
        <Modal.Body pb="8" mt="4">
          <TitleHeading mb="3">Select a type of post</TitleHeading>
          <VStack>
            {modal_selections.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    modal?.setOpen(false);
                    navigation.navigate("CreateAPostScreen", {
                      type: item.type,
                    });
                  }}
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    my="4"
                  >
                    <HStack alignItems="center">
                      <FontAwesome
                        size={20}
                        color={theme.colors.yellow[400]}
                        name={item.icon}
                      />
                      <ParagraphText ml="4">{item.text}</ParagraphText>
                    </HStack>
                    <FontAwesome
                      size={15}
                      color={theme.colors.coolGray[500]}
                      name="chevron-right"
                    />
                  </HStack>
                </TouchableOpacity>
              );
            })}
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
