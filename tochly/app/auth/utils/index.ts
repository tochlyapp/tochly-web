import continueWithSocialAuth from "@/app/auth/utils/socialAuth";


export const continueWithGoogle = () => (
  continueWithSocialAuth('google-oauth2', 'google')
);
export const continueWithFacebook = () => (
  continueWithSocialAuth('facebook', 'facebook')
);
