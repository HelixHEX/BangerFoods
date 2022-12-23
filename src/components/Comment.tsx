import { Avatar, Flex, Text, Icon, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { Comment as CommentType } from "../utils/customTypes";
import { timeSince } from "../utils/helpers";
import { UserContext } from "../utils/UserContex";
import { Trash2 } from "react-feather";
import { supabase } from "../utils/supabase";

const Comment = ({
  comment,
  fetchComments,
}: {
  comment: CommentType;
  fetchComments: () => void;
}) => {
  const { profile } = useContext(UserContext);
  const toast = useToast();

  const removeComment = async () => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", comment.id);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      fetchComments();
    }
  };
  return (
    <Flex mt={10} flexDir="column">
      <Flex>
        <Avatar
          alignSelf={"center"}
          size={"sm"}
          src={comment.owner.avatar_url}
        />
        <Flex alignSelf={"center"} ml={3}>
          <Text fontWeight={"700"} color="secondary">
            {comment.owner.full_name}
          </Text>
          <Flex
            bg="primary"
            alignSelf={"center"}
            rounded="full"
            w={2}
            h={2}
            ml={3}
            mr={3}
          />
          <Text alignSelf={"center"} color="primary">
            {timeSince(new Date(comment.created_at))}
          </Text>
          {comment.owner.id === profile?.id && (
            <Icon
            ml={3}
              onClick={removeComment}
              _hover={{ cursor: "pointer", color: "red.600" }}
              mr={3}
              alignSelf="center"
              color="red.400"
              as={Trash2}
              w={23}
              h={23}
            />
          )}
        </Flex>
      </Flex>
      <Text ml={45} fontWeight={"500"} color="secondary">
        {comment.text}
      </Text>
    </Flex>
  );
};

export default Comment;
