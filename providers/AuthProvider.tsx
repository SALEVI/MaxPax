import { Session } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '~/utils/supabase';

type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // fetch profile
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data || null);
      }

      setLoading(false);
    };

    fetchSession();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // This ensures the listener is removed when the component unmounts
    // return () => data.subscription.unsubscribe();
    // This ensures the listener is removed when the component unmounts
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, profile }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
