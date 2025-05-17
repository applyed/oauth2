/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { TokenModel } from '@applyed/oauth2-server';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';

export interface Token extends TokenModel {
  __typeName: NonAttribute<'CLIENT_MODEL'>;
}
export class Token
  extends Model<InferAttributes<Token>, InferCreationAttributes<Token>>
  implements TokenModel {}

export const initToken = (sequelize: Sequelize) =>
  Token.init(
    {
      clientId: DataTypes.TEXT,
      code: DataTypes.STRING,
      resourceOwnerId: DataTypes.NUMBER, // Is a foriegn key into user.
      scope: DataTypes.TEXT,
      token: DataTypes.TEXT,
      type: DataTypes.STRING,
      createdAt: {
        type: DataTypes.NUMBER,
        defaultValue: () => Date.now(),
      },
      expiresAt: {
        type: DataTypes.NUMBER,
        defaultValue: () => Date.now(),
      },
    },
    {
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['token'],
        },
        {
          unique: false,
          fields: ['code'],
        },
        {
          unique: false,
          fields: ['resourceOWnerId'],
        },
      ],
    }
  );
