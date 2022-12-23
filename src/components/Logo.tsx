import { Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Logo = ({ center }: { center?: boolean }) => {
  const navigate = useNavigate();
  return (
    <>
      <Flex
        _hover={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
        alignSelf={center ? "center" : "start"}
      >
        <Heading color="primary">BANGER</Heading>
        <Heading color="secondary">FOODS</Heading>
      </Flex>
    </>
  );
};

export default Logo;
