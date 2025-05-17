/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { CodeModel } from '@applyed/oauth2-server';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';

export interface Code extends CodeModel {
  __typeName: NonAttribute<'CLIENT_MODEL'>;
}
export class Code
  extends Model<InferAttributes<Code>, InferCreationAttributes<Code>>
  implements CodeModel {}

export const initCode = (sequelize: Sequelize) =>
  Code.init(
    {
      clientId: DataTypes.TEXT,
      code: DataTypes.STRING,
      codeChallenge: DataTypes.STRING,
      codeChallengeMethod: DataTypes.STRING,
      redirectURI: DataTypes.STRING,
      resourceOwnerId: DataTypes.NUMBER, // IS a foreign key.
      scope: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.NUMBER,
        defaultValue: () => Date.now(),
      },
      expiresAt: DataTypes.NUMBER,
    },
    {
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['code'],
        },
      ],
    }
  );
