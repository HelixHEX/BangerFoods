import {
  Avatar,
  Flex,
  Heading,
  Text,
  Textarea,
  useToast,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import Button from "../components/Button";
import { UserContext } from "../utils/UserContex";
import { supabase } from "../utils/supabase";
import Input from "../components/Input";
import Header from "../components/Header";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { profile, setFetchingProfile } = useContext(UserContext);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [file, setFile] = useState<File>();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  if (!profile) <Navigate to='/signin' />

  const upadateProfile = async () => {
    if (!fullName) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      let updates = {
        id: profile!.id,
        full_name: fullName,
        bio,
        avatar_url: '',
      };
      if (file) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`avatar-${profile?.id}-${new Date().toISOString()}.png`, file, { 
            upsert: true,
          });
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        if (data) {
          const { data: url } = await supabase.storage
            .from("avatars")
            .getPublicUrl(data.path);
            console.log(url)
          // setAvatarUrl(url.publicUrl);
          updates.avatar_url = url.publicUrl;
        }
      } else {
        updates.avatar_url = profile?.avatar_url || '';
      }
      await supabase
        .from("profiles")
        .upsert(updates)
        .then(({ error }) => {
          setLoading(false);
          if (!error) {
            toast({
              title: "Success",
              description: "Profile updated",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            setFetchingProfile(true)
          } else {
            setFullName(profile?.full_name || "");
            setBio(profile?.bio || "");
            setAvatarUrl(profile?.avatar_url || "");

            toast({
              title: "Error",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        });
    }
  };

  return (
    <>
      <Header />
      <Flex flexDir={"column"} p={5} pt={20} w="100%" h="100vh">
        <Heading color="secondary" alignSelf={"center"}>
          Edit Profile
        </Heading>
        <Flex
          rounded={10}
          p={5}
          alignSelf={"center"}
          w={{ base: "100%", md: 800 }}
          h="100%"
          boxShadow={"md"}
          flexDir={"column"}
        >
          <Flex
            mb={{ base: 3, md: 0 }}
            w="100%"
            h="100%"
            justify="space-between"
            flexDir={{ base: "column", md: "row" }}
          >
            <Flex flexDir={"column"}>
              <Avatar
                alignSelf={"center"}
                w={{ base: 100, md: 200 }}
                h={{ base: 100, md: 200 }}
                src={avatarUrl ? avatarUrl : file ? URL.createObjectURL(file) : undefined}
                mb={3}
              />
              <label>
                <ChakraInput
                  bg="primary"
                  color="white"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                      setAvatarUrl('');
                    }
                  }}
                />
                <Flex
                  rounded={5}
                  textAlign={"center"}
                  bg="primary"
                  color="white"
                  h={50}
                  w="100%"
                  justify="center"
                  _hover={{ cursor: "pointer", bg: "secondary" }}
                >
                  <Text fontWeight={"600"} alignSelf={"center"}>
                    Choose image
                  </Text>
                </Flex>
              </label>
            </Flex>
            <Flex flexDir={"column"}>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                type="text"
              />
              <Textarea
                mt={3}
                color="primary"
                border="none"
                bg="gray.200"
                h={210}
                w={{ base: "100%", md: 500 }}
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Flex>
          </Flex>
          <Button onClick={upadateProfile} loading={loading}>
            Save Profile
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default Profile;
