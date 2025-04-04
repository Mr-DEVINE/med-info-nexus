
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setIsAuthenticated, setRole, setUsername } = useUser();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);

        if (currentSession?.user) {
          // Get user profile data to set role
          setTimeout(async () => {
            try {
              const { data: profileData } = await supabase
                .from("profiles")
                .select("role, username")
                .eq("id", currentSession.user.id)
                .single();

              if (profileData) {
                setRole(profileData.role as any);
                setUsername(profileData.username || currentSession.user.email || "");
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
            }
          }, 0);
        } else {
          setRole(null);
          setUsername("");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);

      if (currentSession?.user) {
        // Get user profile data to set role
        supabase
          .from("profiles")
          .select("role, username")
          .eq("id", currentSession.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (profileData) {
              setRole(profileData.role as any);
              setUsername(profileData.username || currentSession.user.email || "");
            }
            setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching user profile:", error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setIsAuthenticated, setRole, setUsername]);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
