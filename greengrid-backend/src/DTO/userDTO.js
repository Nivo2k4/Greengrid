export class UserDto {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.nic = user.nic;
    }
}