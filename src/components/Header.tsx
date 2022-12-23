import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Icon,
  VStack,
  Text,
  MenuButton,
  Menu,
  Center,
  MenuList,
  MenuDivider,
  MenuItem,
  Avatar,
  Link,
  Button as ChakraButton,
} from "@chakra-ui/react";
import Logo from "./Logo";
import { Menu as MenuIcon, Plus } from "react-feather";
import { Link as RouterLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../utils/UserContex";
import { supabase } from "../utils/supabase";
import RecipeModal from "./RecipeModal";
import Button from "./Button";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const { profile } = useContext(UserContext);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      <RecipeModal
        type="new"
        title="New Recipe"
        isOpen={isModalOpen}
        onClose={onModalClose}
      />
      <Flex
        zIndex={2}
        backdropFilter="auto"
        backdropBlur="5px"
        p={2}
        pr={5}
        pl={5}
        w="100%"
        justify={"space-between"}
        pos="fixed"
      >
        <Logo />
        {profile ? (
          <Flex display={{ base: "none", md: "flex" }}>
            <Button
              props={{ alignSelf: "center", mr: 3 }}
              h={35}
              w={110}
              onClick={onModalOpen}
            >
              <Text alignSelf={"center"}>New Recipe</Text>
              <Icon as={Plus} w={18} h={18} />
            </Button>
            <Menu>
              <MenuButton
                as={ChakraButton}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Flex color="secondary" _hover={{ color: "primary" }}>
                  <Text fontWeight={"700"} mr={2} alignSelf={"center"}>
                    {profile.full_name}
                  </Text>
                  <Avatar size={"sm"} src={profile.avatar_url} />
                </Flex>
              </MenuButton>
              <MenuList fontWeight={"600"} alignItems={"center"}>
                <br />
                <Center>
                  <Avatar size={"2xl"} src={profile.avatar_url} />
                </Center>
                <br />
                <Center>
                  <Text>{profile.full_name}</Text>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem fontWeight={"600"}>
                  <Link as={RouterLink} to="/my-recipes">
                    My Recipes
                  </Link>
                </MenuItem>
                <MenuItem fontWeight={"600"}>
                  <Link as={RouterLink} to="/profile">
                    My Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={logout} fontWeight={"600"}>
                  <Text>Logout</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <HStack
            display={{ base: "none", md: "block" }}
            spacing={5}
            fontSize={20}
            color="primary"
            flexDir="row"
          >
            <Link
              _hover={{ color: "secondary" }}
              as={RouterLink}
              style={{ textDecoration: "underline" }}
              to="/signin"
            >
              Sign in
            </Link>
          </HStack>
        )}
        <Icon
          color="secondary"
          h={25}
          w={25}
          display={{ base: "flex", md: "none" }}
          as={MenuIcon}
          onClick={onOpen}
          _hover={{ cursor: "pointer", color: "primary" }}
        />
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
          <DrawerOverlay />
          <DrawerContent color="secondary" bg="background">
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>

            <DrawerBody>
              <VStack fontSize={20} fontWeight={"600"}>
                {profile ? (
                  <>
                    <Link
                      _hover={{ color: "secondary" }}
                      as={RouterLink}
                      to="/my-recipes"
                      color="primary"
                    >
                      My Recipes
                    </Link>
                    <Link
                      _hover={{ color: "secondary" }}
                      as={RouterLink}
                      to="/profile"
                      color="primary"
                    >
                      My Profile
                    </Link>
                    <Link
                      _hover={{ color: "secondary" }}
                      as={RouterLink}
                      to="/logout"
                      color="primary"
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      _hover={{ color: "secondary" }}
                      as={RouterLink}
                      to="/signin"
                      color="primary"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  );
};

export default Header;
