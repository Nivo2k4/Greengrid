import userService from "../services/userservice.js";

export const getCurrentUser =async (req,res)=>{
    const user = await userService.getUserById(req.userId);
    res.json(user);
}