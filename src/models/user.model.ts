import { DataTypes, Sequelize, Model } from "sequelize";
import bcrypt from 'bcrypt';
import { UserInterface } from "../interfaces/user.interface";

export interface UserInstance extends Model<UserInterface>, UserInterface {
    validatePassword(password: string): Promise<boolean>;
}

export const UserFactory = (sequelize: Sequelize) => {

    const User = sequelize.define<UserInstance>("User", {
        user_ci: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: "users", 
        timestamps: true,
        hooks: {
            // 3. Usa 'UserInstance' en los hooks
            beforeCreate: async (user: UserInstance) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
            beforeUpdate: async (user: UserInstance) => { 
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    (User as any).prototype.validatePassword = async function(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    };
    
    return User;
};