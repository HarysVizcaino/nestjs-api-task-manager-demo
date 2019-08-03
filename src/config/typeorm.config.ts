import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'harysvizcaino',
    password: 'admin01',
    database: 'taskmanagent',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};
