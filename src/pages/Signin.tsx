import { Center, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Loading from "../components/Loading";
import Logo from "../components/Logo";
import { supabase } from "../utils/supabase";
import { UserContext } from "../utils/UserContex";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { session } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      navigate("/");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [session, navigate]);

  const login = async () => {
    setError("");
    try {
      if (email) {
        const { data, error } = await supabase.auth.signInWithOtp({ email, });
        setLoading(false);
        if (error) {
          setError(error.message);
        } else if (data) {
          toast({
            title: "Success",
            description: "Check your email for the magic link",
            status: "success",
            duration: 5000,
          });
        }
      } else {
        setError("Please your enter email");
      }
    } catch (e: any) {
      setEmail(e.error_description || e.message);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Flex flexDir={"column"} p={5} w="100%" h="100vh">
          <Logo />
          <Center
            mt={{ base: 10, md: 0 }}
            flexDir={"column"}
            alignSelf={"center"}
            w="100%"
            h="100%"
          >
            <Flex
              alignSelf={"center"}
              p={5}
              rounded={10}
              w={{ base: "100%", md: 500 }}
              h={240}
              boxShadow="md"
              flexDir={"column"}
              justify="space-between"
              bg="white"
            >
              <Heading alignSelf={"center"} color="secondary">
                Welcome Back
              </Heading>

              <Center flexDir={"column"} w="100%" h="100%">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                />
                <Text mt={2} color="red" fontWeight={"500"}>
                  {error}
                </Text>
              </Center>
              <Button onClick={login}>
                <Text>Send magic link</Text>
              </Button>
            </Flex>
          </Center>
        </Flex>
      )}
    </>
  );
};

export default Signin;
