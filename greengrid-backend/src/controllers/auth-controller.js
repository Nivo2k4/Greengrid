import { userRegistrationSchema } from '../validators/user-validation-schema.js';
import { ApiError } from '../exceptions/api-error.js';
import authService from '../services/authService.js';
import passport from 'passport';
import { generateAccessToken } from '../utils/jwt.js';

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
export const login = async (req, res,next) => {
    console.log(req.body);
    try {
    passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: info?.message || 'Unauthorized' });
            req.login(user, { session: false }, (loginErr) => {
                console.log(loginErr);
                if (loginErr) return next(loginErr);
                const accessToken = generateAccessToken(user);

            return res.json({ accessToken });
                });
        })(req, res, next);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
