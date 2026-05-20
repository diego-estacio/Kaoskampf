import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export type UsuarioRole = "MASTER" | "ADMIN" | "MEMBER";

export const Roles = (...roles: UsuarioRole[]) => SetMetadata(ROLES_KEY, roles);
