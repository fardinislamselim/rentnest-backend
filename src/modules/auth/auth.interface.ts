import { Role } from "../../../generated/prisma/enums";

// register user
export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: Role;
}

// login user
export interface ILoginUser {
  email: string;
  password: string;
}

// change password
export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}
