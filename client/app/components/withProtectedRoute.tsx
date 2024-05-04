"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define the type for the props of the WrappedComponent
type WrappedComponentProps = {
  [key: string]: any; // Add more specific props if needed
};

// Define the type for the HOC
type WithProtectedRouteProps = {
  [key: string]: any; // Add more specific props if needed
};

const withProtectedRoute = <P extends WrappedComponentProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  // Define the component with proper types
  const WithProtectedRoute: React.FC<WithProtectedRouteProps> = (props) => {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If auth is null or userId is not available, redirect to the login page
      if (!auth || !auth.userId) {
        router.push('/');
      }
    }, [auth, router]);

    // If the user is authenticated, render the WrappedComponent
    // Otherwise, render null while the redirection is in progress
    return auth && auth.userId ? <WrappedComponent {...props as P} /> : null;
  };

  return WithProtectedRoute;
};

export default withProtectedRoute;
