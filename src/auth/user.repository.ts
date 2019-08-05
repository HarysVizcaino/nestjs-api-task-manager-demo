import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.tdo';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    private logger = new Logger('UserRepository');

    async sigNup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        try {
            const salt = await bcrypt.genSalt();

            const user = new User();
            user.username = username;
            user.salt = salt;
            user.password = await this.hashPassword(password, salt);

            await user.save();
        } catch ( error ) {
            if (error.code === '23505') { // duplicate username
                throw new ConflictException('Username already exist');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}
