import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { Usuario } from "../entities/usuario.entity";
import { RolesGuard } from "./roles.guard";

import { EmailService } from "./email.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, EmailService],
  controllers: [AuthController],
  exports: [AuthService, RolesGuard],
})

export class AuthModule {}
