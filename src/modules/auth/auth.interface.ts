import { Role } from "../../../generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: Role;
}
