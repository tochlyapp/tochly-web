import type { Metadata } from 'next';

import Register from '@/app/auth/register/Register';


export const metadata: Metadata = {
  title: 'Register | Tochly',
  description: 'Tochly sign up page'
}

export default function Page() {
  
  return (
    <Register />
  )
}
