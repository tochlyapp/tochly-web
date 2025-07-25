import { User } from 'src/types/user';

export type TeamMemberBase = {
  display_name: string;
  role: 'member' | 'admin';
  title?: string;
  phone_number?: string;
  profile_picture_url?: string;
  online?: boolean;
  status?: string;
}

export type TeamMember = TeamMemberBase & {
  id: number;
  user: User;
  full_name: string;
  profile: Profile;
}

export type ProfileBase = {
  user: number;
  email: string;
  full_name: string;
  timezone?: string;
  dark_mode: boolean;
}

export type Profile = ProfileBase & {
  id: number;
}
