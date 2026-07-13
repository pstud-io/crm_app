export interface ProjectRecord {
  id: string | null;
  project_name: string | null;
}

export const initialProjectSliceState: ProjectRecord = {
  id: null,
  project_name: null,
};
