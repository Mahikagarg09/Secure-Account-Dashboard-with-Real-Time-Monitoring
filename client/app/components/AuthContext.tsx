import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router'; // Change from 'next/navigation' to 'next/router'

interface AuthContextProps {
    children: ReactNode;
}

const AuthContext: React.FC<AuthContextProps> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('userId');

        if (isLoggedIn) {
            // router.push('/user/profile');
        } else {
            router.push('/');
        }
    }, [router]);

    return <>{children}</>; // Use fragment to wrap children
};

export default AuthContext;
