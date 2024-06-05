'use client';

import { makestore } from '@/redux/store';
import { Provider } from 'react-redux';


type Props = {
  children: React.ReactNode;
}

export default function CustomProvider ({ children }: Props) {
  return (
    <Provider store={makestore()}>
      {children}
    </Provider>
  );
}
