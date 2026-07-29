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
  additional_fields: string[];
  field_search: string[];
  include_contacts: boolean;
  organization_contact_id: string;
};

export type LeadsRequestPayload = KanbanRequestPayload & {
  substage_id: string;
};
