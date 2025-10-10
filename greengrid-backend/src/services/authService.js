import { ApiError } from "../exceptions/api-error.js";
import userRepository from "../repository/userRepository.js";
import bcrypt from 'bcryptjs';
import {UserDto} from "../DTO/userDTO.js";

class AuthService {
    // User service methods
    async registerUser(userData) {
            await userRepository.FindByEmail(userData.email);
            const user = await userRepository.FindByEmail(userData.email);
            if (user) {
                throw new ApiError(400,'User already exists');
            }else {
                userData.password = await bcrypt.hash(userData.password, 10);    
                const newUser = await userRepository.createUser(userData);
                return new UserDto (newUser);
            }
    }
}

export default new AuthService();