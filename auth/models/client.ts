/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import type { ClientModel, GrantType } from '@applyed/oauth2-server';

export interface Client extends ClientModel {
  __typeName: NonAttribute<'CLIENT_MODEL'>;
}
export class Client
  extends Model<InferAttributes<Client>, InferCreationAttributes<Client>>
  implements ClientModel {}

export const initClient = (sequelize: Sequelize) =>
  Client.init(
    {
      name: DataTypes.TEXT,
      clientId: DataTypes.TEXT,
      clientSecret: DataTypes.TEXT,
      clientType: DataTypes.STRING,
      grantTypes: {
        type: DataTypes.TEXT,
        get() {
          return this.getDataValue('grantTypes')
            .toString()
            .split(',') as GrantType[];
        },
        set(value: GrantType[]) {
          // @ts-expect-error the types of data and model are coupled.
          this.setDataValue('grantTypes', value.join(','));
        },
      },
      redirectURIs: {
        type: DataTypes.TEXT,
        get() {
          return this.getDataValue('redirectURIs').toString().split(',');
        },
        set(value: string[]) {
          // @ts-expect-error the types of data and model are coupled.
          this.setDataValue('redirectURIs', value.join(','));
        },
      },
      scopes: DataTypes.TEXT,
      ownerId: DataTypes.NUMBER,
      accessTokenExpiry: DataTypes.NUMBER,
      refreshTokenExpiry: DataTypes.NUMBER,
      refreshTokenRotation: DataTypes.NUMBER,
      createdAt: {
        type: DataTypes.NUMBER,
        defaultValue: () => Date.now(),
      },
      updatedAt: {
        type: DataTypes.NUMBER,
        defaultValue: () => Date.now(),
      },
    },
    {
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['clientId'],
        },
        {
          fields: ['ownerId'],
        },
      ],
    }
  );
