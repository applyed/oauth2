import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export enum ThemePreferencesEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare username: string;
  declare password: string | null;
  declare roles: string[];
  declare themePreference: ThemePreferencesEnum;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initUser = (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roles: {
        type: DataTypes.STRING,
        get() {
          return this.getDataValue('roles').toString().split(',');
        },
        set(value: string[]) {
          // @ts-expect-error the types of data and model are coupled.
          this.setDataValue('roles', value.join(','));
        },
      },
      themePreference: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['username'],
        },
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  );
