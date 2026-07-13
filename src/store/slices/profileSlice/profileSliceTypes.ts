export type ProfileSliceState = {
  name: string;
  phone: string;
  is_admin: boolean;
  permissions: unknown[];
  fk_user_role: string;
  organization_contact_id: string;
  organization_details: Record<string, unknown> | undefined;
  organization_id: string;
  logo_url: string;
};

export const initialProfileSliceState: ProfileSliceState = {
  name: "",
  phone: "",
  organization_contact_id: "",
  organization_id: "",
  logo_url: "",
  is_admin: false,
  organization_details: undefined,
  fk_user_role: "",
  permissions: [],
};
