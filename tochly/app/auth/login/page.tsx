import type { Metadata } from 'next';

import Login from '@/app/auth/login/Login';


export const metadata: Metadata = {
  title: 'Login | Tochly',
  description: 'Tochly sign in page'
}

export default function Page() {
  return (
    <Login />
  )
}
