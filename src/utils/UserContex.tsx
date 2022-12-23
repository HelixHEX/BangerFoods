import React, {
  useEffect,
  useState,
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";
import { Text } from "@chakra-ui/react";
import Loading from "../components/Loading";

type UserContextType = {
  session: Session | null;
  profile: {
    id: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
  } | null;
  setFetchingProfile: Dispatch<SetStateAction<boolean>>;
};

const UserContext = createContext<UserContextType>({
  session: null,
  profile: null,
  setFetchingProfile: () => {},
});

const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [fetchingProfile, setFetchingProfile] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;
      await supabase
        .from("profiles")
        .select(`id, full_name, avatar_url, bio`)
        .eq("id", session.user.id)
        .then(({ data, error }) => {
          setFetchingProfile(false);
          setLoading(false);
          if (error) {
            setError(error.message);
            setProfile(null);
          }
          if (data) {
            setProfile(data[0]);
            if (!data[0].full_name && window.location.pathname !== "/profile") {
              window.location.href = "/profile";
            }
          } else {
            setProfile(null);
          }
        });
    };
    fetchProfile();
  }, [fetchingProfile, session]);


  useEffect(() => {
    supabase.auth
      .getSession()
      .then(async ({ data: { session: supabaseSession } }) => {
        setSession(supabaseSession);
        if (supabaseSession) {
          setFetchingProfile(true);
        } else {
          setLoading(false);
        }
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <UserContext.Provider value={{ session, profile, setFetchingProfile }}>
      {error ? <Text>{error}</Text> : loading ? <Loading /> : children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
