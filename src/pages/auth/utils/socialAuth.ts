import { toast } from "react-toastify";

export default async function continueWithSocialAuth(
  provider: string,
  redirect: string
) {
  try {
    const url = `${process.env.REACT_APP_BACKEND_API}/api/o/${provider}/?redirect_uri=${process.env.REACT_APP_REDIRECT_URL}/auth/${redirect}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      credentials: 'include',
    });
    const data = await res.json();

    if (res.status === 200 && typeof window !== 'undefined') {
      window.location.replace(data.authorization_url);
    } else {
      toast.error('Something went wrong!');
    }
  } catch (error) {
    toast.error('Something went wrong!');
  }
}