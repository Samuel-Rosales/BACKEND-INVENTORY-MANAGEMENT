import { DataTypes, Sequelize, Model, Optional } from "sequelize";
import bcrypt from 'bcrypt';
import { UserInterface } from "../interfaces/user.interface";

// 1. Definimos qué atributos son opcionales al CREAR un usuario
// (Por ejemplo, 'status' tiene defaultValue, así que es opcional al crear)
// Asumimos que UserInterface tiene todas las columnas.
interface UserCreationAttributes extends Optional<UserInterface, 'status'> {}

// 2. Definimos la Instancia completa
export interface UserInstance extends Model<UserInterface, UserCreationAttributes>, UserInterface {
    validatePassword(password: string): Promise<boolean>;
    // A veces es necesario declarar createdAt/updatedAt si TS se pone estricto
    createdAt?: Date;
    updatedAt?: Date;
}

export const UserFactory = (sequelize: Sequelize) => {
    // 3. Pasamos AMBOS genéricos a define: <Instancia, AtributosDeCreación>
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
            beforeCreate: async (user: UserInstance) => {
                if (user.password) { // Chequeo de seguridad extra
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user: UserInstance) => {
                // El error común suele estar aquí con .changed()
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    // 4. Asignación del prototipo
    (User.prototype as any).validatePassword = async function (password: string): Promise<boolean> {
        // 'this' aquí se refiere a la instancia del modelo
        return await bcrypt.compare(password, this.password);
    };

    return User;
};