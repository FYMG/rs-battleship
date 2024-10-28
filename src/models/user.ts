import validateObject from '../utils/helpers/validateObject';

export interface IUser {
  name: string;
  password: string;
  index: string;
}

export type UserParams = IUser | Record<PropertyKey, unknown>;

const userSchema = {
  name: 'string',
  password: 'string',
  index: 'string',
};

export default class User {
  constructor(user: UserParams) {
    validateObject(userSchema, user);

    Object.assign(this, user);
  }
}

const user = (user: UserParams) => new User(user);

export { user, userSchema };
