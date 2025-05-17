import { Sequelize } from 'sequelize';
import { initUser } from '../models/user';
import { initClient } from '../models/client';
import { initCode } from '../models/code';
import { initToken } from '../models/token';

export const sequelize = new Sequelize(process.env.DB_CONN_STR ?? '');

export const initDB = async () => {
  await sequelize.authenticate();
  initUser(sequelize);
  initClient(sequelize);
  initCode(sequelize);
  initToken(sequelize);
  sequelize.sync();
};
