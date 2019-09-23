import React, { useState, useEffect } from "react";
import RecipeList from "./RecipeList";
import RecipeEdit from "./RecipeEdit";
import "../css/app.css";
import uuidv4 from "uuid/v4";

export const RecipeContext = React.createContext();
const LOCAL_STORAGE_KEY = "wds_cookingWithReact.App.recipes";

function App() {
  const [selectedRecipeId, setSelectedRecipeId] = useState();
  const [recipes, setRecipes] = useState(sampleRecipes);
  const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId);

  useEffect(() => {
    const recipeJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (recipeJSON != null) setRecipes(JSON.parse(recipeJSON));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  const RecipeContextValue = {
    handleRecipeAdd,
    handleRecipeDelete,
    handleRecipeSelect,
    handleRecipeChange
  };

  function handleRecipeSelect(id) {
    setSelectedRecipeId(id);
  }

  function handleRecipeAdd() {
    const newRecipe = {
      id: uuidv4(),
      name: "",
      servings: 1,
      cookTime: "1:00",
      instructions: "",
      ingredients: [{ id: uuidv4(), name: "", amount: "" }]
    };

    setSelectedRecipeId(newRecipe.id);
    setRecipes([...recipes, newRecipe]);
  }

  function handleRecipeChange(id, recipe) {
    const newRecipes = [...recipes];
    const index = newRecipes.findIndex(r => r.id === id);
    newRecipes[index] = recipe;
    setRecipes(newRecipes);
  }

  function handleRecipeDelete(id) {
    if (selectedRecipeId != null && selectedRecipeId === id) {
      setSelectedRecipeId(undefined);
    }
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  }

  return (
    <RecipeContext.Provider value={RecipeContextValue}>
      <RecipeList recipes={recipes} />
      {selectedRecipe && <RecipeEdit recipe={selectedRecipe} />}
    </RecipeContext.Provider>
  );
}

const sampleRecipes = [
  {
    id: 1,
    name: "Corn and Eggs",
    servings: 3,
    cookTime: "1:45",
    instructions: "1. Heat Corn\n2. Crack Eggs\n3. Cook Eggs",
    ingredients: [
      { id: 1, name: "Eggs", amount: "1/2 Dzn" },
      { id: 2, name: "Corn", amount: "1 Cup" },
      { id: 3, name: "Butter", amount: "1 Tbs" }
    ]
  },
  {
    id: 2,
    name: "Popcorn",
    servings: 5,
    cookTime: "0:45",
    instructions: "1. Heat Butter\n2. Put popcorn in pan\n3. Burn popcorn",
    ingredients: [
      { id: 1, name: "Popcorn", amount: "1 Cup" },
      { id: 2, name: "Salt", amount: "to taste" },
      { id: 3, name: "Butter", amount: "1 Tbs" }
    ]
  }
];

export default App;
