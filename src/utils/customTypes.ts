export type Recipe = {
  id: number;
  name: string;
  description: string;
  recipes_img_url: string;
  owner: string;
  prep_time: string;
  skill: string;
  serves: string;
  ingredients: Array<string>;
  directions: Array<string>;
};

export type Comment = {
  id: number;
  created_at: string;
  text: string;
  recipe: number;
  owner: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
};
