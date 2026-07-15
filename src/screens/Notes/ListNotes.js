import React, { useCallback, useState } from "react";
import { View, FlatList, RefreshControl, Text } from "react-native";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { Colors, SH, SW } from "../../utils";
import { Button, Spacing } from "../../components/common";
import images from "../../images";
import NoteCard from "./components/NoteCard";
import { useNoteEndpoints } from "./hooks/useNoteEndPoints";
import { formElementsStyles } from "../../components/UI/Dropdown/formElementStyles";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { body } from "../../components/UI/DesignSystem/typography";
import { Badge } from "../../components/UI/Badge/Badge";
import badgeColors from "../../components/UI/Badge/badgeColors";
import { Input } from "react-native-elements";
import { SearchOutline } from "../../svg";
import {
  EmptyContent,
  LoadingIndicatorFooter,
} from "../../components/UI/GeneralComponents";
import { setActiveSubButtonGlobal } from "../../store/slices/activeSubButtonGlobal";

const ListNotes = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const activeTabButtonID = useSelector(
    (state) => state.activeSubButtonGlobal.activeSubButtonGlobal,
  );
  const project = useSelector((state) => state.project);
  const [notesData, setNotesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState({ getNotes: false });
  const [refreshing, setRefreshing] = useState(false);
  const { getNotes } = useNoteEndpoints();
  const dispatch = useDispatch();
  const fetchData = useCallback(async () => {
    if (project?.id) {
      await getNotes(project.id, setLoading, setNotesData);
    }
  }, [project?.id]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setInitialLoading(true);
        await fetchData();
        setInitialLoading(false);
      };

      loadData();
    }, [project]),
  );

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        dispatch(setActiveSubButtonGlobal("notes"));
      }
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
  };

  const searchedNotesData = notesData.filter((note) => {
    const noteTitle = note?.title || "";
    return noteTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: primaryColors.gray[50],
        paddingHorizontal: 4,
      }}
    >
      <Spacing space={SH(16)} />

      <View
        style={{
          paddingHorizontal: SW(12),
          paddingVertical: SH(0),
          borderWidth: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: SW(8),
          }}
        >
          <Text
            style={{
              ...body.lg.semiBold,
              color: primaryColors.gray[1000],
            }}
          >
            Notes
          </Text>
          <Badge
            color={badgeColors.gray}
            text={searchedNotesData.length.toString()}
            size={"lg"}
          />
        </View>
      </View>
      <Spacing space={SH(16)} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: SW(16),
          gap: SW(12),
        }}
      >
        <Input
          renderErrorMessage={false}
          placeholder="Quick Search"
          placeholderTextColor={primaryColors.gray[500]}
          leftIconContainerStyle={{
            margin: 0,
            height: SH(20),
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          leftIcon={() => (
            <SearchOutline
              width={SW(16)}
              height={SH(16)}
              strokeWidth={SW(2)}
              stroke={primaryColors.gray[500]}
            />
          )}
          style={{ flexGrow: 1 }}
          inputStyle={{
            color: Colors.black_text_color,
            minHeight: SH(20),
            maxHeight: SH(20),
            height: "100%",
            ...body.sm.regular,
          }}
          containerStyle={{
            borderRadius: SW(12),
            backgroundColor: "white",
            height: SH(40),
            paddingHorizontal: 0,
            flex: 1,
            flexGrow: 1,
            elevation: 1,
            shadowColor: "#0A0D12",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
          }}
          inputContainerStyle={{
            borderWidth: 1,
            borderColor: Colors.gray_line_color,
            backgroundColor: "white",
            width: "100%",
            height: "100%",
            padding: SW(10),
            gap: SW(2),
            borderRadius: SW(12),
          }}
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
        {/* {activeSubButton === "created" && (
              <FilterSortPopover
                id={"created-tasks"}
                title={"Created Tasks Filter"}
                filterMethods={createdFilterMethods}
                filterState={createdFilterState}
                setFilterState={setCreatedFilterState}
                initialFilterState={initialCreatedFilterState}
                sortMethods={createdSortMethods}
                sortState={createdSortState}
                setSortState={setCreatedSortState}
                initialSortState={initialCreatedSortState}
              />
            )} */}
      </View>
      <Spacing space={SH(8)} />

      {initialLoading ? (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            borderWidth: 0,
            flex: 1,
          }}
        >
          <LoadingIndicatorFooter />
        </View>
      ) : (
        <FlatList
          data={searchedNotesData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: SW(15),
            flexGrow: 1,
          }}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() =>
                navigation.push("NoteDetails", {
                  note: item,
                  project,
                })
              }
            />
          )}
          ListHeaderComponent={<Spacing space={SH(10)} />}
          ListEmptyComponent={
            <EmptyContent
              onPress={() =>
                navigation.push("TabNavigator", {
                  screen: "MoreStack",
                  params: {
                    screen: "AddNote",
                    params: {
                      project_id: project.id,
                      project,
                    },
                  },
                })
              }
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={primaryColors.brand[1000]}
              colors={[primaryColors.brand[1000]]}
              progressBackgroundColor={Colors.white}
            />
          }
        />
      )}

      {/* {project?.id !== "all_projects" && (
        <View style={styles.floatingButtonContainer}>
          <Shadow
            style={{ borderRadius: SW(12) }}
            distance={SW(9)}
            startColor="#E5E7EB"
            offset={[SW(2), SW(2)]}
          >
            <Button
              title={"Add Note"}
              buttonStyle={formElementsStyles.floatingButton}
              color={primaryColors.button.active}
              titleStyle={{ ...body.md.semiBold }}
              onPress={() =>
                navigation.navigate("AddNote", {
                  project_id: project.id,
                  project,
                })
              }
            />
          </Shadow>
        </View>
      )} */}
    </View>
  );
};

export default ListNotes;
