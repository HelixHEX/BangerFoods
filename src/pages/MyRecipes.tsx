import { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { supabase } from "../utils/supabase";
import { type Recipe } from "../utils/customTypes";
import { Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import Header from "../components/Header";
import RecipeCard from "../components/RecipeCard";
import { UserContext } from "../utils/UserContex";
import { Navigate } from "react-router-dom";

const MyRecieps = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const {profile} = useContext(UserContext)

  useEffect(() => {
    const main = async () => {
      await supabase
        .from("recipes")
        .select(
          "id, owner, name, description, recipes_img_url, prep_time, skill, serves, ingredients, directions"
        )
        .eq('owner', profile!.id)
        .then(({ data, error }) => {
          setLoading(false);
          if (error) {
            setError(error.message);
          } else {
            console.log(data);
            setRecipes(data);
          }
        });
    };

    main();
  }, [profile]);

  if (!profile) return <Navigate to='signin' />


  if (loading) return <Loading />;

  return (
    <>
      <Header />
      <Flex flexDir={"column"} p={5} pt={20} w="100%" h="100vh">
        {error && (
          <Heading w="100%" color="secondary" alignSelf="center">
            {error}
          </Heading>
        )}
        <Heading alignSelf={"center"} color="secondary">
          My Recipes
        </Heading>
        {recipes.length > 0 ? 
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
      </Grid> : <Text fontSize={20} fontWeight={'500'} alignSelf={'center'} color='gray.10'>You have no recipes. Feel free to create one now :)</Text>}
      </Flex>
    </>
  );
};

export default MyRecieps;
