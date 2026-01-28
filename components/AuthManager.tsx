'use client';

import useAuthentication from '@/hooks/useAuthentication';
import React, { ReactNode } from 'react';
import Loading from './Loading';
import { usePathname, useRouter } from 'next/navigation';

interface AuthManagerProps {
    children: ReactNode;
}

const AuthManager: React.FC<AuthManagerProps> = ({ children }) => {
    const { user } = useAuthentication();
    const pathname = usePathname()
    const router = useRouter()

    const authRoutes = ['/auth/login','/auth/register'];

    if (user === undefined && !authRoutes.includes(pathname)) return <Loading />;

    if (user === null && !authRoutes.includes(pathname)) router.push("/auth/login");

    return <>{children}</>;

};

export default AuthManager;