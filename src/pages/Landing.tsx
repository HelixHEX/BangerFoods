import { Flex, GridItem, Heading, Image, Grid } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import RecipeCard from "../components/RecipeCard";
import Button from "../components/Button";
import { supabase } from "../utils/supabase";
import Loading from "../components/Loading";
import { Recipe } from "../utils/customTypes";

const App = () => {
  const [recipes, setRecipes] = useState<any>([]);
  const recipesRef = useRef<any>(null);
  const executeScroll = () => recipesRef.current.scrollIntoView();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const main = async () => {
      await supabase
        .from("recipes")
        .select(
          "id, owner, name, description, recipes_img_url, prep_time, skill, serves, ingredients, directions"
        )
        .then(({ data, error }) => {
          setLoading(false);
          if (error) {
            setError(error.message);
          } else {
            setRecipes(data);
          }
        });
    };

    main();
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <Header />
      {error && (<Heading w='100%' color='secondary' alignSelf='center'>{error}</Heading>)}
      <Flex flexDir={"column"} w="100%" minH="100vh" h="auto">
        <Flex flexDir={"column"} p={5} bg="background" w="100%" h="100vh">
          <Flex
            flexDir={{ base: "column", md: "row" }}
            h="100%"
            justify={"space-between"}
          >
            <Flex flexDir={"column"} alignSelf={"center"}>
              <Heading
                mt={{ base: 10, md: 10 }}
                textAlign={{ base: "center", md: "start" }}
                fontSize={60}
                color="secondary"
              >
                Look for a
              </Heading>
              <Flex>
                <Heading mr={2} fontSize={60} color="primary">
                  BANGER
                </Heading>
                <Heading fontSize={60} color="secondary">
                  recipe
                </Heading>
              </Flex>
              <Button
                onClick={executeScroll}
                borderRadius="full"
                bg="primary"
                color="background"
                variant="solid"
              >
                Look for recipes
              </Button>
            </Flex>
            <Image
              alignSelf={"center"}
              w={{ base: 300, md: 400 }}
              h={{ base: 300, md: 400 }}
              src={require("../assets/images/banner.png")}
            />
          </Flex>
        </Flex>
        <Flex
          ref={recipesRef}
          flexDir={"column"}
          p={5}
          w="100%"
          minH="100vh"
          h="auto"
          pt={20}
        >
          <Heading textAlign={"center"} color="secondary">
            Recipes
          </Heading>
          <Grid
            templateColumns={{
              base: "repeat(auto-fill, minmax(300px, 1fr))",
              md: "repeat(auto-fill, minmax(420px, 1fr))",
            }}
            gap={20}
            mt={10}
          >
            {recipes.map((recipe: Recipe, index: number) => (
              <GridItem alignSelf={"center"} key={index}>
                <RecipeCard recipe={recipe} />
              </GridItem>
            ))}
          </Grid>
        </Flex>
        <Footer />
      </Flex>
    </>
  );
};

export default App;
