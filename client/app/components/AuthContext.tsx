"use client"
// import { useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface AuthContextProps {
//     children: ReactNode;
//     // router: any; // Change the type as needed
// }

// const AuthContext: React.FC<AuthContextProps> = ({ children }) => {
//     const router = useRouter();
//     useEffect(() => {
//         const isLoggedIn = localStorage.getItem('userId');

//         if (isLoggedIn) {
//             router.push('/user');
//         } else {
//             router.push('/');
//         }
//     }, [router]);

//     return <>{children}</>;
// };

// export default AuthContext;

import { createContext, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
    children: ReactNode;
}

interface AuthContextType {
    router: any; // Change the type as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};

export const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('userId');

        if (isLoggedIn) {
            router.push('/user');
        } else {
            router.push('/');
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ router }}>
            {children}
        </AuthContext.Provider>
    );
};
