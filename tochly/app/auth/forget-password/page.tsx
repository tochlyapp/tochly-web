import type { Metadata } from 'next';

import ForgetPassword from '@/app/auth/forget-password/ForgetPassword';


export const metadata: Metadata = {
  title: 'Reset Password | Tochly',
  description: 'Tochly password reset page'
}

export default function Page() {
  return (
    <ForgetPassword />
  )
}
