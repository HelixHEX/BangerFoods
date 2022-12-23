import { Flex, Text, Icon, Link } from "@chakra-ui/react";
import Logo from "./Logo";
import { Heart } from "react-feather";
import { Link as RouterLink } from "@chakra-ui/react";

const Footer = () => {
  return (
    <>
      <Flex mt={10} justify={"center"} w="100%" h={200} bg="background">
        <Logo center={true} />
        <Flex color="primary" pos="absolute" bottom={5}>
          <Text>Made with Love</Text>
          <Icon ml={2} mr={2} alignSelf="center" as={Heart} color="secondary" />
          <Link _hover={{color: 'secondary'}} textDecoration={'underline'} to='https://eliaswambugu.com' as={RouterLink}>
            Elias Wambugu
          </Link>
        </Flex>
      </Flex>
    </>
  );
};

export default Footer;
