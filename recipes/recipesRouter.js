const express = require('express')
const Recipes = require('./recipesModel')
const Ingredients = require('./ingredients/ingredientsModel')
const Instructions = require('./instructions/instructionsModel')


const router = express.Router()

//get all recipes from all users
router.get('/all', (req, res) => {
    Recipes.getAllRecipes()
    .then(recipes => {
        console.log(recipes)
        res.status(200).json(recipes)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

// get recipe by id from any user
router.get('/all/:id', validateRecipeId, (req, res) => {
    res.status(200).json(req.recipe)    
})


//get all recipes from logged-in user
router.get('/my-recipes', (req, res) => {
    const user_id = req.jwt.subject
    Recipes.getUserRecipes(user_id)
    .then(userRecipes => {
        console.log(userRecipes)
        if(!userRecipes) {
            res.status(404).json({ message: 'you do not have any recipes' })
        } else {
            res.status(200).json(userRecipes)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//get logged-in user's recipe by id
router.get('/my-recipes/:id', validateUserRecipe, (req, res) => {
    // const user_id = req.jwt.username
    // const { id } = req.params

    // Recipes.findById(id)
    // .then(recipe => {
    //     console.log(recipe)
    //     if(recipe.username === user_id) {
    //         res.status(200).json(recipe)
    //     } else {
    //         res.status(403).json({ message: 'recipe not yours' })
    //     }
    // })
    // .catch(err => {
    //     res.status(500).json({ message: err.message })
    // })

    res.status(200).json(req.recipe)
})

//add logged-in user's new recipe
router.post('/my-recipes', (req, res) => {
    const { title, source, image, description, category, user_id } = req.body
    const userId = req.jwt.subject

    Recipes.addUserRecipe({ title, source, image, description, category, user_id: userId })
    .then(recipe => {
        console.log(recipe)
        res.status(201).json({message: 'recipe added', recipe})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//removed logged-in user's recipe
router.delete('/my-recipes/:id', validateRecipeId, validateUserRecipe, (req, res) => {
    const { id } = req.params

    Recipes.removeUserRecipe(id)
    .then(count => {
        console.log(count)
        if(count > 0) {
            res.status(200).json({ message: 'recipe removed' })
        } else {
            res.status(400).json({ message: 'error removing recipe' })
        }
       
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//edit logged-in users recipe
router.put('/my-recipes/:id', validateRecipeId, validateUserRecipe, (req, res) => {
    const { id }  = req.params
    const changes = req.body
    // const userId = req.jwt.subject

    Recipes.updateUserRecipe(id, changes)
    .then(count => {
        console.log(count)
        if(count > 0) {
            res.status(200).json({message: 'recipe updated' })
        } else {
            res.status(400).json({ message: 'error updating recipe' })
        }  
    })
    .catch(err => {
        console.log(err)
    })
})

//get any users recipe ingredients

//get all ingredients for a recipe
router.get('/my-recipes/:id/ingredients', (req, res) => {
    const { id } = req.params

    Ingredients.getIngredients(id)
    .then(ingredients => {
        console.log(ingredients)
        res.status(200).json(ingredients)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//get a particular ingredient for a recipe
//*** need to add user validation */
router.get('/my-recipes/:id/ingredients/:ing_id', (req, res) => {
    const { id, ing_id } = req.params

    Ingredients.findIngredientById(ing_id)
    .then(ingredient => {
        console.log(ingredient)
        res.status(200).json(ingredient)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//add an ingredient to a recipe
//*** need to add user validation */
router.post('/my-recipes/:id/ingredients', (req, res) => {
    const { id } = req.params
    const { ingredient, recipe_id } = req.body

    Ingredients.addIngredients({ ingredient, recipe_id: id})
    .then(ingredient => {
        console.log(ingredient)
        res.status(201).json(ingredient)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//remove a particular ingredient from a recipe
//*** need to add user validation */
router.delete('/my-recipes/:id/ingredients/:ing_id', (req, res) => {
    const { id, ing_id} = req.params

    Ingredients.removeIngredients(ing_id) 
    .then(count => {
        console.log(count)
        if(count > 0) {
            res.status(200).json({ message: 'ingredient removed' })
        } else {
            res.status(400).json({ message: 'error removing ingredient' })
        }
        
    })
    .catch(err => {
        console.log(err)
    })
})

//edit a recipe's particular ingredient 
//*** need to add user validation */
router.put('/my-recipes/:id/ingredients/:ing_id', (req, res) => {
    const { id, ing_id } = req.params
    const { ingredient, recipe_id } = req.body

    Ingredients.updateIngredients(ing_id, { ingredient, recipe_id: id })
    .then(updated => {
        console.log(updated)
        if(updated > 0) {
            res.status(200).json({ message: 'ingredient updated' })
        } else {
            res.status(400).json({ message: 'error updating ingredient' })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//get any user's recipe instructions
router.get('/all/:id/instructions', (req, res) => {
    const { id } = req.params

    Instructions.getInstructions(id)
    .then(instructions => {
        console.log(instructions)
        res.status(200).json(instructions)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//get user's recipe instructions
//*** need to add user validation */
router.get('/my-recipes/:id/instructions', (req, res) => {
    const { id } = req.params

    Instructions.getInstructions(id)
    .then(instructions => {
        console.log(instructions)
        res.status(200).json(instructions)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//add instructions for a recipe
router.post('/my-recipes/:id/instructions', (req, res) => {
    const { id } = req.params
    const { step_number, instructions, recipe_id } = req.body

    Instructions.addInstructions({ step_number, instructions, recipe_id: id})
    .then(directions => {
        console.log(directions)
        res.status(201).json(directions)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
})

//edit instructions for a recipe
router.put('/my-recipes/:id/instructions/:ins_id', (req,res) => {
    const { id, ins_id } = req.params
    const { instructions, recipe_id, step_number } = req.body

    // Instructions.findInstructionsById(ins_id).then(instructions => {
    //     Instructions.updateInstructions(ins_id, { instructions, recipe_id: id })
    //     .then(updated => {
    //         console.log(updated)
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    // }) 

    Instructions.updateInstructions(ins_id, { instructions, recipe_id: id, step_number })
        .then(updated => {
            console.log(updated)
            if(updated > 0) {
                res.status(200).json({ message: 'instructions updated'})
            } else {
                res.status(400).json({ message: 'error updating instructions'})
            } 
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: err.message })
        })
   
})





/******* custom middleware ********/

//searches for all recipes by id
//if no recipe, return 404 error
function validateRecipeId(req, res, next) {
    const { id } = req.params
    const user_id = req.jwt.username
   
    Recipes.findById(id)
    .then(recipe => {
        if(!recipe && recipe.username !== user_id) {
            res.status(404).json({ message: 'recipe not found' })
        } else {
            req.recipe = recipe
            next()
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
       
}

//searches for recipe by id
//if no recipe, return 404 error
//if the recipe doesn't belong to the user, return 403 error
function validateUserRecipe(req, res, next) {
    const user_id = req.jwt.username
    const { id } = req.params

    Recipes.findById(id)
    .then(recipe => {
         if (recipe.username !== user_id) {
            res.status(403).json({ message: 'recipe not yours' })
            
        } else {
            // res.status(200).json(recipe)
            req.recipe = recipe
            next()
        }
    })
    .catch(err => {
        res.status(500).json({ message: err.message })
    }) 
}

// function validatePostRecipe(req, res, next) {
//     const { title, category } = req.body

//     if(!req.body) {
//         res.status(400).json({ message: 'missing recipe information' })
//     } else if(!title && category === null) {
//         res.status(400).json({ message: 'recipe needs title and category'})
//     } else {
//         next()
//     }
// }


module.exports = router