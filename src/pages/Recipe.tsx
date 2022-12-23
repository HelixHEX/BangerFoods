import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabase";
import {
  Comment as CommentType,
  Recipe as RecipeType,
} from "../utils/customTypes";
import {
  Avatar,
  Divider,
  Flex,
  Heading,
  Image,
  ListItem,
  Stack,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { UserContext } from "../utils/UserContex";
import Button from "../components/Button";
import RecipeModal from "../components/RecipeModal";
import Comment from "../components/Comment";

const Recipe = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id } = useParams();
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { profile } = useContext(UserContext);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);

  const toast = useToast();

  const createComment = async () => {
    if (!comment) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      const { error } = await supabase
        .from("comments")
        .insert([{ recipe: recipe?.id, owner: profile?.id, text: comment }]);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setComment("");
        fetchComments();
        toast({
          title: "Success",
          description: "Comment created",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const fetchComments = useCallback(async () => {
    await supabase
      .from("comments")
      .select("id, created_at, owner(*), text, recipe")
      .eq("recipe", id)
      .then(({ data, error }) => {
        setLoadingComments(false);
        if (error) {
          setError(error.message);
        } else {
          setComments(data);
        }
      });
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const main = async () => {
      await supabase
        .from("recipes")
        .select(
          "id, owner, name, description, recipes_img_url, prep_time, skill, serves, ingredients, directions"
        )
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          setLoadingRecipe(false);
          if (error) {
            if (
              error.message ===
              "JSON object requested, multiple (or no) rows returned"
            )
              setError("Recipe not found");
            else setError(error.message);
          } else if (!data) {
            setError("Recipe not found");
          } else {
            setRecipe(data);
          }
        });
    };

    main();
    fetchComments();
  }, [id, fetchComments]);

  if (loadingRecipe) return <Loading />;

  if (error) return <Heading color="secondary">{error}</Heading>;

  return (
    <>
      <Header />
      <Flex p={2} w="100%" minH="100vh" h="auto" pt={20} flexDir={"column"}>
        <Flex flexDir={{ base: "column", md: "row" }}>
          {recipe && (
            <>
              <RecipeModal
                type="edit"
                title="Edit Recipe"
                isOpen={isOpen}
                onClose={onClose}
                recipe={recipe}
              />
              <Image
                rounded={10}
                src={recipe.recipes_img_url}
                w={{ base: "100%", md: 300 }}
                h={300}
                fallbackSrc="https://via.placeholder.com/300"
              />
              <Flex
                mt={{ base: 5, md: 0 }}
                flexDir={"column"}
                w="100%"
                ml={{ base: 0, md: 10 }}
              >
                <Flex>
                  <Heading color="primary">{recipe.name}</Heading>
                  {recipe.owner === profile?.id && (
                    <Button
                      props={{ ml: 3, alignSelf: "center" }}
                      h={30}
                      w={50}
                      onClick={onOpen}
                    >
                      <Text>Edit</Text>
                    </Button>
                  )}
                </Flex>
                <Text fontSize={20} mt={5} color="gray">
                  {recipe.description}
                </Text>
                <Heading mt={5} fontSize={20} color="secondary">
                  Ingredients
                </Heading>
                <UnorderedList>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem mt={3} key={index}>
                      {ingredient}
                    </ListItem>
                  ))}
                </UnorderedList>
                <Heading mt={5} fontSize={20} color="secondary">
                  Directions
                </Heading>
                <UnorderedList>
                  {recipe.directions.map((direction, index) => (
                    <ListItem mt={3} key={index}>
                      {direction}
                    </ListItem>
                  ))}
                </UnorderedList>
                <Stack
                  w={{ base: "auto", md: 400 }}
                  justify="space-between"
                  fontSize={20}
                  mt={5}
                  direction={{ base: "column", md: "row" }}
                >
                  <Flex flexDir={"column"}>
                    <Text color="gray.10">Prep Time</Text>
                    <Text
                      alignSelf={{ base: "start", md: "center" }}
                      fontWeight={"600"}
                      color="primary"
                    >
                      {recipe.prep_time}
                    </Text>
                  </Flex>
                  <Flex flexDir={"column"}>
                    <Text color="gray.10">Serves</Text>
                    <Text
                      alignSelf={{ base: "start", md: "center" }}
                      fontWeight={"600"}
                      color="primary"
                    >
                      {recipe.serves}
                    </Text>
                  </Flex>
                  <Flex flexDir={"column"}>
                    <Text
                      alignSelf={{ base: "start", md: "center" }}
                      color="gray.10"
                    >
                      Skill
                    </Text>
                    <Text fontWeight={"600"} color="primary">
                      {recipe.skill}
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
            </>
          )}
        </Flex>
        <Divider mt={10} />
        <Flex flexDir='column' pl={{base: 2, md: 40}} pr={{base: 2, md: 40}}>
        <Heading mt={5} color="secondary" alignSelf={"center"}>
          Comments
        </Heading>
        {profile && (
          <Flex
          mb={10}
            mt={5}
            justify={{ base: "start", md: "space-between" }}
            flexDir={{ base: "column", md: "row" }}
          >
            <Flex h={50}>
              <Avatar
                alignSelf={"center"}
                size={"sm"}
                src={profile?.avatar_url}
              />
              <Text
                color="secondary"
                fontWeight="700"
                ml={2}
                alignSelf={"center"}
              >
                {profile?.full_name}
              </Text>
            </Flex>
            <Flex
              p={2}
              flexDir="column"
              rounded={10}
              ml={{ base: 0, md: 5 }}
              boxShadow={"2xl"}
              bg="white"
              w={{ base: "100%", md: "80%" }}
              h={300}
              justify='center'
            >
              <Textarea
              minH={240}
                placeholder="Leave a comment"
                h={240}
                maxH={240}
                border="none"
                bg="none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                props={{ alignSelf: "flex-end", mt: 2 }}
                variant="solid"
                bg="primary"
                w={100}
                color="white"
                h={35}
                onClick={createComment}
                disabled={comment.length === 0 ? true : false}
                
              >
                <Text>Comment</Text>
              </Button>
            </Flex>
          </Flex>
        )}
        {loadingComments && <Heading color="secondary">Loading...</Heading>}
        {comments && (
          <Flex flexDir={"column"}>
            {comments.map((comment, index) => (
              <Comment
                fetchComments={fetchComments}
                comment={comment}
                key={index}
              />
            ))}
          </Flex>
        )}
        </Flex>
      </Flex>
    </>
  );
};

export default Recipe;
