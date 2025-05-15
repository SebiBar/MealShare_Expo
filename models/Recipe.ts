import { Ingredient } from "./Ingredient"
import { User } from "./User"

export interface Recipe {
    id?: number
    title: string
    description?: string
    link?: string
    prepTime?: number
    cookTime?: number
    servingSize?: number
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    ingredients?: Ingredient[]
    user?: User
}