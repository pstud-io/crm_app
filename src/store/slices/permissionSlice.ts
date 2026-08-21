import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PermissionCategory =
  | "activity"
  | "auth"
  | "authtoken"
  | "core"
  | "crm"
  | "customer"
  | "financial"
  | "manpower"
  | "moodboards"
  | "order";

type CategorizedPermissions = Record<PermissionCategory, string[]>;

interface PermissionsState {
  permissions: string[];
  categorizedPermissions: CategorizedPermissions;
}

const initialState: PermissionsState = {
  permissions: [],
  categorizedPermissions: {
    activity: [],
    auth: [],
    authtoken: [],
    core: [],
    crm: [],
    customer: [],
    financial: [],
    manpower: [],
    moodboards: [],
    order: [],
  },
};

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },

    categorizePermissions: (state) => {
      state.categorizedPermissions = state.permissions.reduce(
        (categories, permission) => {
          const category = permission.split(".")[0] as PermissionCategory;

          if (state.categorizedPermissions[category]) {
            categories[category].push(permission);
          } else {
            (categories as Record<string, string[]>)[category] = [permission];
          }

          return categories;
        },
        { ...state.categorizedPermissions } as CategorizedPermissions,
      );
    },

    removePermissions: (state) => {
      state.permissions = [];
      state.categorizedPermissions = {
        activity: [],
        auth: [],
        authtoken: [],
        core: [],
        crm: [],
        customer: [],
        financial: [],
        manpower: [],
        moodboards: [],
        order: [],
      };
    },
  },
});

export const { setPermissions, categorizePermissions, removePermissions } =
  permissionsSlice.actions;

export default permissionsSlice.reducer;

export const loadPermissions = async (
  dispatch: (action: any) => void,
): Promise<void> => {
  console.log("Loading Permissions from storage...");

  try {
    const permissions = await AsyncStorage.getItem("permissions");

    if (permissions) {
      const parsedPermissions: string[] = JSON.parse(permissions);

      dispatch(setPermissions(parsedPermissions));
      dispatch(categorizePermissions());
    }
  } catch (error) {
    console.error("Error loading permissions:", error);
  }
};

export const savePermissions = async (
  permissions: string[],
  dispatch: (action: any) => void,
): Promise<void> => {
  try {
    await AsyncStorage.setItem("permissions", JSON.stringify(permissions));

    dispatch(setPermissions(permissions));
    dispatch(categorizePermissions());
  } catch (error) {
    console.error("Error saving permissions:", error);
  }
};

export const removePermissionsFromStorage = async (
  dispatch: (action: any) => void,
): Promise<void> => {
  try {
    console.log("Removing Permissions from storage...");

    await AsyncStorage.removeItem("permissions");
    dispatch(removePermissions());
  } catch (error) {
    console.error("Error removing permissions:", error);
  }
};
