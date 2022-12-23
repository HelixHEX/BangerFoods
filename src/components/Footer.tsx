import { Flex, Text, Icon } from "@chakra-ui/react";
import Logo from "./Logo";
import { Heart } from "react-feather";

const Footer = () => {
  return (
    <>
      <Flex mt={10} justify={'center'} w="100%" h={200} bg="background">
        <Logo center={true} />
        <Flex color='primary' pos='absolute' bottom={5}>
          <Text>Made with Love</Text>
          <Icon ml={2} mr={2} alignSelf='center' as={Heart} color="secondary" />
          <Text>Elias Wambugu</Text>
        </Flex>
      </Flex>
    </>
  );
};

export default Footer;
