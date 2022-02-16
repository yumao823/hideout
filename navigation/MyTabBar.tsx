import * as React from "react";
import { Box, theme } from "native-base";
import { TouchableOpacity, View, SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export function MyTabBar({ state, descriptors, navigation, openModal }) {
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingVertical: 8,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          if (route.name === "PostScreen") {
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={() => {
                  openModal(true);
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box bgColor="yellow.400" p="2" borderRadius="full">
                  <TabBarIcon
                    name={options.icon}
                    color={theme.colors.coolGray[800]}
                    size={18}
                  />
                </Box>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TabBarIcon
                name={options.icon}
                color={
                  isFocused
                    ? theme.colors.coolGray[100]
                    : theme.colors.coolGray[500]
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
}) {
  return (
    <FontAwesome size={props.size ? props.size : 22} style={{}} {...props} />
  );
}
