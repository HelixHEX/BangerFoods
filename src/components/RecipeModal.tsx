import React, { useContext, useState } from "react";
import { Recipe } from "../utils/customTypes";
import Button from "./Button";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Image,
  Text,
  Textarea,
  Select,
  Heading,
  Icon,
  useToast,
  Input as ChakraInput,
  useDisclosure,
  ModalFooter,
} from "@chakra-ui/react";
import Input from "./Input";
import { Plus, Trash2 } from "react-feather";
import { supabase } from "../utils/supabase";
import { UserContext } from "../utils/UserContex";
import { useNavigate } from "react-router-dom";

const RecipeModal = ({
  recipe,
  onClose,
  title,
  isOpen,
  type,
}: {
  recipe?: Recipe;
  onClose: () => void;
  title: string;
  isOpen: boolean;
  type: "new" | "edit";
}) => {
  const { profile } = useContext(UserContext);
  const toast = useToast();
  const [name, setName] = useState<string>(recipe?.name || "");
  const [description, setDescription] = useState<string>(
    recipe?.description || ""
  );
  const [recipes_img_url, setRecipes_img_url] = useState<string>(
    recipe?.recipes_img_url || ""
  );
  const [prep_time, setPrep_time] = useState<string>(recipe?.prep_time || "");
  const [skill, setSkill] = useState<string>(recipe?.skill || "");
  const [serves, setServes] = useState<string>(recipe?.serves || "");
  const [ingredients, setIngredients] = useState<Array<string>>(
    recipe?.ingredients || []
  );
  const [directions, setDirections] = useState<Array<string>>(
    recipe?.directions || []
  );
  const [file, setFile] = useState<File>();

  const updateIngredient = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = e.target.value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const updateDirection = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newDirections = [...directions];
    newDirections[index] = e.target.value;
    setDirections(newDirections);
  };

  const removeDirection = (index: number) => {
    const newDirections = [...directions];
    newDirections.splice(index, 1);
    setDirections(newDirections);
  };

  const createRecipe = async () => {
    if (!file) {
      toast({
        title: "Please upload an image",
        description: "This ensures quality recipes are added to the site :)",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (
      name &&
      description &&
      prep_time &&
      serves &&
      skill &&
      ingredients.length > 0 &&
      directions.length > 0
    ) {
      const recipeData = {
        name,
        description,
        recipes_img_url: "",
        prep_time,
        serves,
        skill,
        ingredients,
        directions,
        owner: profile?.id,
      };
      if (file) {
        const { data, error } = await supabase.storage
          .from("recipe-imgs")
          .upload(
            `recipe-${recipe?.id}-${new Date().toISOString()}.png`,
            file,
            {
              upsert: true,
            }
          );
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
            .from("recipe-imgs")
            .getPublicUrl(data.path);
          setRecipes_img_url(url.publicUrl);
          recipeData.recipes_img_url = url.publicUrl;
        }
      } else {
        recipeData.recipes_img_url = recipe?.recipes_img_url || "";
      }

      await supabase
        .from("recipes")
        .insert(recipeData)
        .then(({ error }) => {
          if (error) {
            toast({
              title: "Error",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Success",
              description: "Recipe created",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            setName("");
            setDescription("");
            setRecipes_img_url("");
            setPrep_time("");
            setSkill("");
            setServes("");
            setIngredients([]);
            setDirections([]);
            onClose();
            if (window.location.pathname === "/") {
              window.location.reload();
            }
          }
        });
    } else {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateRecipe = async () => {
    if (
      name &&
      description &&
      prep_time &&
      serves &&
      skill &&
      ingredients.length > 0 &&
      directions.length > 0
    ) {
      const recipeData = {
        name,
        description,
        recipes_img_url: "",
        prep_time,
        serves,
        skill,
        ingredients,
        directions,
      };
      if (file) {
        const { data, error } = await supabase.storage
          .from("recipe-imgs")
          .upload(
            `recipe-${recipe?.id}-${new Date().toISOString()}.png`,
            file,
            {
              upsert: true,
            }
          );
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
            .from("recipe-imgs")
            .getPublicUrl(data.path);
          setRecipes_img_url(url.publicUrl);
          recipeData.recipes_img_url = url.publicUrl;
        }
      } else {
        recipeData.recipes_img_url = recipe?.recipes_img_url || "";
      }

      await supabase
        .from("recipes")
        .update(recipeData)
        .eq("id", recipe?.id)
        .then(({ error }) => {
          if (error) {
            toast({
              title: "Error",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Success",
              description: "Recipe updated",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            onClose();
            if (
              window.location.pathname === "/" ||
              window.location.pathname.includes("/recipe")
            ) {
              window.location.reload();
            }
          }
        });
    } else {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal
        scrollBehavior="inside"
        size="3xl"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir={{ base: "column", md: "row" }}>
              <Flex justifyContent={"space-between"} flexDir="column">
                <Image
                  rounded={5}
                  w={{ base: "100%", md: 400 }}
                  h={200}
                  mb={{ base: 3, md: 0 }}
                  src={
                    recipes_img_url
                      ? recipes_img_url
                      : file
                      ? URL.createObjectURL(file)
                      : undefined
                  }
                  fallbackSrc="https://via.placeholder.com/400"
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
                        setRecipes_img_url("");
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
              <Flex w="100%" ml={{ base: 0, md: 5 }} flexDir="column">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Recipe Name"
                />
                <Textarea
                  mt={3}
                  color="primary"
                  border="none"
                  bg='white'
                  boxShadow={'xl'}
                  h={210}
                  rounded={10}
                  maxH={210}
                  minH={210}
                  w={"100%"}
                  placeholder="Recipe description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Flex>
            </Flex>
            <Flex
              justify={{ base: "start", md: "space-between" }}
              mt={5}
              flexDir={{ base: "column", md: "row" }}
            >
              <Flex flexDir="column">
                <Text color="gray.10">Prep Time</Text>
                <Select
                  placeholder="Select time"
                  variant="outline"
                  borderColor="primary"
                  color="primary"
                  defaultValue={prep_time}
                  onChange={(e) => setPrep_time(e.target.value)}
                >
                  <option value="5m">5m</option>
                  <option value="10m">10m</option>
                  <option value="15m">15m</option>
                  <option value="30m">30m</option>
                  <option value="1hr">1hr</option>
                  <option value="2hr">2hr</option>
                  <option value=">2hr">{">2hr"}</option>
                </Select>
              </Flex>
              <Flex mt={{ base: 3, md: 0 }} flexDir="column">
                <Text color="gray.10">Serves</Text>
                <Select
                  placeholder="Select amount"
                  variant="outline"
                  borderColor="primary"
                  color="primary"
                  defaultValue={serves}
                  onChange={(e) => setServes(e.target.value)}
                >
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                  <option value="6">6 people</option>
                  <option value="7">7 people</option>
                  <option value="8">8 people</option>
                  <option value="9">9 people</option>
                  <option value="10">10 people</option>
                  <option value=">10">{">10 people"}</option>
                </Select>
              </Flex>
              <Flex mt={{ base: 3, md: 0 }} flexDir="column">
                <Text color="gray.10">Skill</Text>
                <Select
                  placeholder="Select difficulty"
                  variant="outline"
                  borderColor="primary"
                  color="primary"
                  defaultValue={skill}
                  onChange={(e) => setSkill(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
              </Flex>
            </Flex>
            <Flex mt={5} flexDir="column">
              <Flex>
                <Heading alignSelf={"center"} fontSize={20} color="secondary">
                  Ingredients
                </Heading>
                <Icon
                  onClick={() => setIngredients([...ingredients, ""])}
                  _hover={{ cursor: "pointer", bg: "primary", color: "white" }}
                  ml={3}
                  w={23}
                  h={23}
                  as={Plus}
                  borderColor="primary"
                  color="primary"
                  borderWidth={2}
                  borderRadius="full"
                />
              </Flex>
              <Flex flexDir="column">
                {ingredients.map((ingredient: string, index: number) => (
                  <InputGroup
                    key={index}
                    remove={removeIngredient}
                    update={updateIngredient}
                    index={index}
                    value={ingredient}
                    placeholder="Ingredient"
                  />
                ))}
              </Flex>
            </Flex>
            <Flex mt={5} flexDir="column">
              <Flex>
                <Heading alignSelf={"center"} fontSize={20} color="secondary">
                  Directions
                </Heading>
                <Icon
                  onClick={() => setDirections([...directions, ""])}
                  _hover={{ cursor: "pointer", bg: "primary", color: "white" }}
                  ml={6}
                  w={23}
                  h={23}
                  as={Plus}
                  borderColor="primary"
                  color="primary"
                  borderWidth={2}
                  borderRadius="full"
                />
              </Flex>
              <Flex flexDir="column">
                {directions.map((direction: string, index: number) => (
                  <InputGroup
                    key={index}
                    remove={removeDirection}
                    update={updateDirection}
                    index={index}
                    value={direction}
                    placeholder="Direction"
                  />
                ))}
              </Flex>
            </Flex>
            {type === "new" ? (
              <Button props={{ mt: 5 }} onClick={createRecipe}>
                <Text>Create Recipe</Text>
              </Button>
            ) : (
              <>
                <Button props={{ mt: 5 }} onClick={updateRecipe}>
                  <Text>Save</Text>
                </Button>
                <DeleteRecipe closeMainModal={onClose} id={recipe!.id} />
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const InputGroup = ({
  remove,
  update,
  index,
  value,
  placeholder,
}: {
  remove: (index: number) => void;
  update: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  index: number;
  value: string;
  placeholder: string;
}) => {
  return (
    <Flex mt={3}>
      <Icon
        onClick={() => remove(index)}
        _hover={{ cursor: "pointer", color: "red.600" }}
        mr={3}
        alignSelf="center"
        color="red.400"
        as={Trash2}
        w={23}
        h={23}
      />
      <Input
        value={value}
        onChange={(e) => update(e, index)}
        placeholder={placeholder}
        type="text"
      />
    </Flex>
  );
};

const DeleteRecipe = ({
  id,
  closeMainModal,
}: {
  id: number;
  closeMainModal: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate()

  const deleteRecipe = async () => {
    setLoading(true);
    await supabase
      .from("recipes")
      .delete()
      .match({ id })
      .then(({ error }) => {
        setLoading(false);
        onClose();
        if (error) {
          toast({
            title: "Error",
            description: "There was an error deleting your recipe.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Success",
            description: "Your recipe has been deleted.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          closeMainModal();
          navigate('/')
        }
      });
  };
  return (
    <>
      <Button
        onClick={onOpen}
        color="red.600"
        borderColor="red.600"
        props={{ mt: 3 }}
      >
        <Text>Delete Recipe</Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>This action cannot be reversed.</Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="solid" props={{ mr: 3 }} onClick={onClose}>
              Close
            </Button>
            <Button
              loading={loading}
              onClick={deleteRecipe}
              color="white"
              variant="solid"
              bg="red.600"
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecipeModal;
