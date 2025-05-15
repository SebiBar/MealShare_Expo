import { Recipe } from "./Recipe"
import { User } from "./User"

export interface Search {
    recipes: Recipe[]
    users: User[]
}