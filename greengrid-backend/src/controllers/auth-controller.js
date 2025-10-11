import { userRegistrationSchema } from '../validators/user-validation-schema.js';
import { ApiError } from '../exceptions/api-error.js';
import authService from '../services/authService.js';


export const register = async (req, res,next) => {
    console.log(req.body);    
    try {
        const {error} = userRegistrationSchema.validate(req.body);  
        if (error)  throw new ApiError(400, error.details[0].message);
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    
    }catch (error) {
        console.log(error);
        next(error);
}
}
