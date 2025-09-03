import { create } from 'zustand';

export type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  state?: string;
  contact?: string;
  email_id?: string;
  image?: string;
};

type SchoolListState = {
  schools: School[];
  setSchools: (schools: School[]) => void;
  addSchool: (school: School) => void;
  clearSchools: () => void;
};

export const useSchoolListStore = create<SchoolListState>((set) => ({
  schools: [],
  setSchools: (schools) => set({ schools }),
  addSchool: (school) =>
    set((state) => ({ schools: [...state.schools, school] })),
  clearSchools: () => set({ schools: [] }),
}));
