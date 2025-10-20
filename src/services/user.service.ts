import { UserDB, RolDB  } from "../config";
import { UserInterface } from "../interfaces";

class UserService {
    async getAll() {
        try {
            const users = await UserDB.findAll({
                include: [{
                    model: RolDB, as: "rol"
                }]
            });
            return {
                status: 200,
                message: "Users obtained correctly",
                data: users,
            }
        } catch (error) {
            console.error("Error fetching users", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(user_ci: string) {
        try {
            const user = await UserDB.findByPk(user_ci, {
                include: [{
                    model: RolDB, as: "rol"
                }]
            });

            return {
                status: 200,
                message: "User obtained correctly",
                data: user,
            };
        } catch (error) {
            console.error("Error fetching user: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(user: UserInterface) {
        try {
            const { createdAt, updatedAt, ... userData } = user;

            const newUser = await UserDB.create(userData);
            
            return {
                status: 201,
                message: "User created successfully",
                data: newUser,
            };
        } catch (error) {
            console.error("Error creating user: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(ci: string, user: Partial<UserInterface>) {
        try {
            const { createdAt, updatedAt, ci: _, ... userData} = user;
            
            await UserDB.update(userData, { where: { ci } });

            const updatedUser = await UserDB.findByPk(ci);

            return {
                status: 200,
                message: "User update correctly",
                data: updatedUser,
            };
        } catch (error) {
            console.error("Error updating user: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete ( user_ci: string ) {
        try {
            await UserDB.destroy({ where: { user_ci } });

            return { 
                status: 200,
                message: "User deleting successfully",
            }
        } catch (error) {
            console.error("Error deleting user", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    } 
}

export const UserServices = new UserService();