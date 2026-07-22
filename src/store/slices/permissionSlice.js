import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the initial state for permissions
const initialState = {
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

// Create the slice
export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },

    categorizePermissions: (state) => {
      state.categorizedPermissions = state.permissions.reduce(
        (categories, permission) => {
          const category = permission.split(".")[0]; // Extract the category (before the first dot)
          if (state.categorizedPermissions[category]) {
            categories[category].push(permission);
          } else {
            categories[category] = [permission];
          }
          return categories;
        },
        { ...state.categorizedPermissions },
      );
    },

    // Action to remove permissions
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

export const loadPermissions = async (dispatch) => {
  console.log("Loading Permissions from storage...");
  try {
    // Assuming permissions are stored in AsyncStorage
    const permissions = await AsyncStorage.getItem("permissions");
    if (permissions) {
      const parsedPermissions = JSON.parse(permissions); // Assuming the permissions are stored as a JSON string
      dispatch(setPermissions(parsedPermissions)); // Dispatch permissions to the store
      dispatch(categorizePermissions()); // Categorize the permissions
    }
  } catch (error) {
    console.error("Error loading permissions:", error);
  }
};

export const savePermissions = async (permissions, dispatch) => {
  try {
    // console.log('Saving Permissions to storage:', permissions);
    await AsyncStorage.setItem("permissions", JSON.stringify(permissions)); // Save permissions as a JSON string
    dispatch(setPermissions(permissions)); // Dispatch to the store
    dispatch(categorizePermissions()); // Categorize the permissions
  } catch (error) {
    console.error("Error saving permissions:", error);
  }
};

// Action to remove permissions from AsyncStorage and Redux store
export const removePermissionsFromStorage = async (dispatch) => {
  try {
    console.log("Removing Permissions from storage...");
    await AsyncStorage.removeItem("permissions"); // Remove permissions from AsyncStorage
    dispatch(removePermissions()); // Dispatch to Redux to reset the permissions
  } catch (error) {
    console.error("Error removing permissions:", error);
  }
};
