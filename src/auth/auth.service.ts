import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.tdo';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload-interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtServices: JwtService,
        ) {}

        signUp(authCredentialdto: AuthCredentialsDto): Promise<void> {
          return  this.userRepository.sigNup(authCredentialdto);
        }

       async signIn(authCredentialdto: AuthCredentialsDto): Promise<{ accessToken: string }> {
            const username = await this.userRepository.validateUserPassword(authCredentialdto);
            if (!username) {
                throw new UnauthorizedException('Invalid Credentials');
            }
            const payload: JwtPayload = { username };
            const accessToken = await this.jwtServices.sign(payload);

            return { accessToken };
        }
}
