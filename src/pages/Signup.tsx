import { Center, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Logo from "../components/Logo";
// import { supabase } from "../utils/supabase";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [_error, setError] = useState("");

  // const signup = async () => {
  //   setError("");
  //   try {
  //     if (email && password) {
  //       const { data, error } = await supabase.auth.signUp({
  //         email,
  //         password,
  //       });
  
  //       if (error) {
  //         setError(error.message);
  //       }
  
  //       if (data) {
  //         console.log(data);
  //       }
  //     } else {
  //       setError("Please enter email and password");
  //     }
  //   } catch(e: any) {
  //     setEmail(e.error_description || e.message)
  //   }
  // };
  return (
    <>
      <Flex flexDir={"column"} p={5} w="100%" h="100vh">
        <Logo />
        <Center
          mt={{ base: 10, md: 0 }}
          flexDir={"column"}
          alignSelf={"center"}
          w='100%'
        >
          <Heading color='secondary'>Welcome</Heading>
          <Flex
            p={10}
            rounded={10}
            w={{ base: '100%', md: 500 }}
            h={{ base: 400, md: 500 }}
            boxShadow="md"
            flexDir={"column"}
            justify="space-between"
            bg="white"
          >
            <Text fontSize={20} fontWeight={"700"} color='secondary'>
              Signup
            </Text>
            <Center flexDir={"column"} w="100%" h="100%">
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Email"
              />
              <Input
              mt={5}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
              <Input
                mt={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
              <Input
                mt={5}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
              />
            </Center>
            <Flex flexDir={"column"}>
              <Button>
                <Text>Sginup</Text>
              </Button>
              <Flex
                onClick={() => navigate("/signin")}
                _hover={{ cursor: "pointer" }}
                mt={2}
                fontWeight="600"
                alignSelf={"flex-end"}
              >
                <Text color="secondary">Already a user?</Text>
                <Text ml={2} color="primary">
                  Signin
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Center>
      </Flex>
    </>
  );
};

export default Signup;
