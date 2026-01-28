'use client';

import { useCallback, useEffect, useState } from 'react';
import { AuthUser } from '../services/Auth';
import { getUser } from '@/lib/dal';

export default function useAuthentication(){
  const [localUser, setLocalUser] = useState<AuthUser | null | undefined>();

  const checkAuthStatus = useCallback(async () => {
    const user = await getUser();
    setLocalUser(user)
  },[]);

  useEffect(()=>{
    if(localUser === undefined){
      checkAuthStatus();
    }
  },[localUser,checkAuthStatus])

  useEffect(() => {
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000); // Check every 5 minute
    return () => clearInterval(interval);
  }, []);

  return { user: localUser };
}