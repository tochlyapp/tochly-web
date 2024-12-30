export type CreateTeam = {
  name: string;
  description: string;
};

export interface Team extends CreateTeam {
  id: number;
  tid: string;
  created: string;
}
