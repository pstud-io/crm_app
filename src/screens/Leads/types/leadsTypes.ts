export type KanbanRequestPayload = {
  main_stage_id: string | null;
  limit: number;
  page_size: number;
  search: string;
  city: string;
  client_phone: string;
  client_email: string;
  budget: string;
  start_date: string | null;
  end_date: string | null;
  additional_fields: unknown[];
  field_search: unknown[];
  include_contacts: boolean;
  organization_contact_id: string;
};

export type LeadsRequestPayload = {
  substage_id: string;
  main_stage_id: null;
  limit: number;
  page_size: number;
  search: string;
  city: string;
  client_phone: string;
  client_email: string;
  budget: string;
  start_date: string | null;
  end_date: string | null;
  additional_fields: unknown[];
  field_search: unknown[];
  include_contacts: boolean;
  organization_contact_id: string;
};
