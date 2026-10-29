import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VisibleField {
  name: string;
  value: boolean;
  type: "standard" | "additional";
}

export type VisibleFieldsState = Record<string, VisibleField>;

export const initialVisibleState: VisibleFieldsState = {
  created_on: {
    name: "Created On",
    value: false,
    type: "standard",
  },
  brand: {
    name: "Brand",
    value: false,
    type: "standard",
  },
  project_type: {
    name: "Project Type",
    value: false,
    type: "standard",
  },
  lead_source: {
    name: "Lead Source",
    value: false,
    type: "standard",
  },
  legal_name: {
    name: "Legal Name",
    value: false,
    type: "standard",
  },
  city: {
    name: "City",
    value: false,
    type: "standard",
  },
  budget: {
    name: "Budget",
    value: false,
    type: "standard",
  },
  client_email: {
    name: "Client Email",
    value: false,
    type: "standard",
  },
  state: {
    name: "State",
    value: false,
    type: "standard",
  },
  organization_contacts: {
    name: "Assignee",
    value: false,
    type: "standard",
  },
};

export const visibleFieldsSlice = createSlice({
  name: "visibleFields",
  initialState: initialVisibleState,
  reducers: {
    setVisibleFields: (_state, action: PayloadAction<VisibleFieldsState>) =>
      action.payload,

    setAdditionalFields: (
      state,
      action: PayloadAction<{ id: string; name: string }[]>,
    ) => {
      // Remove previously loaded additional fields.
      Object.keys(state).forEach((id) => {
        if (state[id].type === "additional") {
          delete state[id];
        }
      });

      // Add the latest additional fields from the API.
      action.payload.forEach(({ id, name }) => {
        state[id] = {
          name,
          value: state[id]?.value ?? false,
          type: "additional",
        };
      });
    },

    toggleVisibleField: (state, action: PayloadAction<string>) => {
      const field = state[action.payload];

      if (!field) return;

      field.value = !field.value;
    },
  },
});

export const { setVisibleFields, setAdditionalFields, toggleVisibleField } =
  visibleFieldsSlice.actions;

export default visibleFieldsSlice.reducer;
