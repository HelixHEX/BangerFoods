import { Flex, Image, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "../utils/customTypes";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const  navigate = useNavigate();
  return (
    <>
      <Flex
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        _hover={{
          boxShadow: "lg",
          cursor: "pointer",
          transform: "scale(1.02)",
        }}
        p={{ base: 2, md: 5 }}
        rounded={10}
        bg="white"
        w={"100%"}
        h={{ base: 170, md: 300 }}
        boxShadow={"md"}
        flexDir="column"
        justify={"space-between"}
        zIndex={1}
      >
        <Flex>
          <Image
            w={{ base: 100, md: 200 }}
            h={{ base: 100, md: 200 }}
            src={recipe.recipes_img_url}
            fallbackSrc="https://via.placeholder.com/400"
            rounded={10}
            alignSelf={{ base: "center", md: "start" }}
          />
          <Flex h="100%" ml={{ base: 2, md: 5 }} flexDir={"column"}>
            <Heading w={{ base: 180, md: 200 }} isTruncated color="primary">
              {recipe.name}
            </Heading>
            <Text noOfLines={3} fontSize={{ base: 12, md: 15 }} color="gray">
              {recipe.description}
            </Text>
          </Flex>
        </Flex>
        <Flex mt={5} justify={"space-between"}>
          <Flex flexDir="column">
            <Text fontWeight={"400"} alignSelf={"center"} color="gray">
              Prep Time
            </Text>
            <Text
              fontSize={{ base: 18, md: 22 }}
              fontWeight={"600"}
              alignSelf={"center"}
              color="primary"
            >
              {recipe.prep_time}
            </Text>
          </Flex>
          <Flex flexDir="column">
            <Text alignSelf={"center"} color="gray">
              Serves
            </Text>
            <Text
              fontSize={{ base: 18, md: 22 }}
              fontWeight={"600"}
              alignSelf={"center"}
              color="primary"
            >
              {recipe.serves}
            </Text>
          </Flex>
          <Flex flexDir="column">
            <Text alignSelf={"center"} color="gray">
              Skill
            </Text>
            <Text
              fontSize={{ base: 18, md: 22 }}
              fontWeight={"600"}
              alignSelf={"center"}
              color="primary"
            >
              {recipe.skill}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default RecipeCard;
