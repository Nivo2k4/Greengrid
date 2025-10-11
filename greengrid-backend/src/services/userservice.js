import userRepository from '../repository/userRepository.js';
import { UserDto } from '../DTO/userDTO.js';

class UserService { 
    async getUserById(userId) {
        console.log("userId in service:", userId);
        const user = await userRepository.findById(userId);
        return new UserDto(user);
    }
}
export default new UserService();