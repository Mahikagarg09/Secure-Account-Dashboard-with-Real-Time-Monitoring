"use client"
import { useEffect, ReactNode } from 'react';

interface AuthContextProps {
    children: ReactNode;
    router: any; // Change the type as needed
}

const AuthContext: React.FC<AuthContextProps> = ({ children, router }) => {
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('userId');

        if (isLoggedIn) {
            router.push('/user');
        } else {
            router.push('/');
        }
    }, [router]);

    return <>{children}</>;
};

export default AuthContext;