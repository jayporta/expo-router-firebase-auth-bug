import { onAuthStateChanged, User } from "firebase/auth";
import { AuthContextType } from "./authTypes";
import { auth } from "../firebaseAuth";
import { ReactNode, createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
  loading: true,
  user: null,
});

export const useAuthContext = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      (result) => {
        if (result) {
          // Signed in
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUser(result);
        } else {
          // Signed out
          setUser(null);
        }

        if (loading) setLoading(false);
      }
    );

    return unsubscribeFromAuthStatuChanged;
  }, [loading]);

  return {
    loading,
    user,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={useAuthContext()}>
    {children}
  </AuthContext.Provider>
);
