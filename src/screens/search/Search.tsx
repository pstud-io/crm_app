import {
  ActivityIndicator,
  Keyboard,
  KeyboardEventName,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { center, fullWidth, xstack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { ModuleSearchInput } from "@/components/ModuleSearchInput";
import { useTheme } from "@/hooks/useTheme";
import { useSearchEndpoints } from "./hooks/useSearchEndpoints";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { CloseOutlineIcon } from "@/svg";
import { SearchModules } from "./components/SearchModules";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { borderRadius, borderWidth } from "@/design/borders";
import { SubTabBar } from "@/components/SubTabBar";
import {
  SearchSectionState,
  searchSubButtons,
  SubButtonId,
  UniversalSearchState,
} from "./types/searchTypes";
import { ListWrapper } from "@/components/ListWrapper";

export const Search = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { searchLoading, getAllData } = useSearchEndpoints();
  const insets = useSafeAreaInsets();
  const [activeSubButton, setActiveSubButton] =
    useState<SubButtonId<typeof searchSubButtons>>("all");
  const [searchData, setSearchData] = useState<UniversalSearchState | null>(
    null,
  );
  const [searching, setSearching] = useState(false);

  const translateY = useSharedValue(0);

  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        dispatch(setActiveSubButtonGlobal("search"));
        inputRef.current?.focus();
      }, 100); // small delay helps after navigation

      return () => clearTimeout(timeout);
    }, []),
  );

  useEffect(() => {
    const keyboardShow: KeyboardEventName =
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";

    const keyboardHide: KeyboardEventName =
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";

    const show = Keyboard.addListener(keyboardShow, (e) => {
      const distanceToMove = Platform.OS === "android" ? 0 : insets.bottom;
      translateY.value = withTiming(
        -(e.endCoordinates.height - distanceToMove),
        {
          duration: 250,
        },
      );
    });

    const hide = Keyboard.addListener(keyboardHide, (e) => {
      translateY.value = withTiming(0, {
        duration: 300,
      });
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  const universalSearch = usePaginatedSearch<any>({
    //@ts-ignore
    data: searchData,
    //@ts-ignore
    setData: setSearchData,
    getData: getAllData,
    loading: searchLoading.getAllData,
    pageSize: 10,
    extraParams: {},
  });

  return (
    <ListWrapper>
      <SubTabBar
        data={searchSubButtons}
        activeTab={activeSubButton}
        onTabPress={setActiveSubButton}
        extraTitle={() => ""}
      />
      <Animated.View
        style={[
          xstack,
          fullWidth,
          animatedStyle,
          {
            alignItems: "center",
            justifyContent: "space-between",
            gap: spacing.xs,
            paddingHorizontal: spacing.sm,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 16,
            zIndex: 999,
          },
        ]}
      >
        <ModuleSearchInput
          value={universalSearch.searchTerm}
          onChangeText={(text: string) => {
            if (text === "") {
              universalSearch.setSearchTerm(text);
              setSearchData(null);
              setSearching(false);
              return;
            } else {
              setSearching(true);
              universalSearch.onSearch(text);
            }
          }}
          ref={inputRef}
          onFocus={() => setSearching(true)}
          // onBlur={() => {
          //   setSearching(false);
          //   universalSearch.setSearchTerm("");
          //   setSearchData([]);
          // }}
          placeholder="Search leads, tasks, notes..."
          containerStyle={{ height: 48 }}
          inputContainerStyle={{
            borderRadius: borderRadius.full,
            boxShadow: theme.shadow.md,
            borderWidth: borderWidth.hw,
            paddingRight: spacing.xs,
          }}
          rightIcon={
            searching && (
              <TouchableOpacity
                onPress={() => {
                  universalSearch.setSearchTerm("");
                  setSearching(false);
                  setSearchData(null);
                  Keyboard.dismiss();
                }}
                style={[center, { width: 32, height: 32 }]}
              >
                {activeSubButton === "all" ? (
                  searchLoading.getAllData ? (
                    <ActivityIndicator size={4} color={theme.text} />
                  ) : (
                    <CloseOutlineIcon
                      fill={theme.text}
                      width={14}
                      height={14}
                    />
                  )
                ) : (
                  <CloseOutlineIcon fill={theme.text} width={14} height={14} />
                )}
              </TouchableOpacity>
            )
          }
        />
      </Animated.View>
      <SearchModules
        search={universalSearch.searchTerm}
        searchData={searchData}
        loading={searchLoading.getAllData}
        onEndReached={universalSearch.onEndReached}
        // onRefresh={async () =>
        //   await universalSearch.onRefresh(universalSearch.searchTerm)
        // }
        refreshing={universalSearch.refreshing}
        activeSubButton={activeSubButton}
        setActiveSubButton={setActiveSubButton}
      />
    </ListWrapper>
  );
};
