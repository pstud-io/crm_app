import { ItemSeparator } from "@/components/ItemSeperator";
import { MenuItem } from "@/components/MenuItem";
import {
  center,
  fullHeight,
  fullWidth,
  topCenter,
  xstack,
  ystack,
} from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useAuth } from "@/hooks/useAuth";
import { useModulesData } from "@/hooks/useModulesData";
import { useTheme } from "@/hooks/useTheme";
import { Role } from "@/types/AuthTypes";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  Button,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  UserNavigationProp,
  UserStackParamsList,
} from "@/navigation/UserNavigation";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import AddProject from "@/components/common/AddProject/AddProject";
import { ModuleSearchInput } from "@/components/ModuleSearchInput";
import { Spacing } from "@/components";
import { ListModules } from "./components/ListModules";
import { SearchModules } from "./components/SearchModules";
import { useDashboardEndpoints } from "./hooks/useDashboardEndpoints";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { CloseOutlineIcon } from "@/svg";
export const Dashboard = () => {
  const { theme } = useTheme();
  const { dashboardLoading, getAllData } = useDashboardEndpoints();
  const [searchData, setSearchData] = useState<any>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const dispatch = useDispatch();
  const dashboardSearch = usePaginatedSearch<any>({
    data: searchData,
    setData: setSearchData,
    getData: getAllData,
    loading: dashboardLoading.getAllData,
    pageSize: 10,
    extraParams: {},
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("dashboard"));
    }, []),
  );

  return (
    <>
      <View
        style={[
          xstack,
          fullWidth,
          {
            alignItems: "center",
            justifyContent: "space-between",
            gap: spacing.lg,
            paddingTop: spacing.huge,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <ModuleSearchInput
          value={dashboardSearch.searchTerm}
          onChangeText={async (text: string) => {
            if (text === "") {
              dashboardSearch.setSearchTerm(text);
              setSearchData([]);
              return;
            }
            dashboardSearch.onSearch(text);
          }}
          onFocus={() => {
            setSearching(true);
          }}
          onBlur={() => {
            setSearching(false);
            dashboardSearch.setSearchTerm("");
            setSearchData([]);
          }}
          placeholder={"Search leads, tasks, notes..."}
        />
        {searching && (
          <TouchableOpacity
            onPress={() => {
              dashboardSearch.setSearchTerm("");
              setSearching(false);
              setSearchData([]);
              Keyboard.dismiss();
            }}
          >
            <CloseOutlineIcon fill={theme.text} width={12} height={12} />
          </TouchableOpacity>
        )}
      </View>
      {searching && (
        <SearchModules
          search={dashboardSearch.searchTerm}
          searchData={searchData}
          loading={dashboardLoading.getAllData}
          onEndReached={dashboardSearch.onEndReached}
          onRefresh={dashboardSearch.onRefresh}
          refreshing={dashboardSearch.refreshing}
        />
      )}
      {!searching && <ListModules />}
      <AddProject />
    </>
  );
};
