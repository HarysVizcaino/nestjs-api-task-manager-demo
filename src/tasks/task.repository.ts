import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.tdo';
import { TaskStatus } from './task.enum';
import { GetTaskFilters } from './dto/get-task-filters.tdo';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getQueryTask(getTaskFilter: GetTaskFilters, user: User): Promise<Task[]> {
        const { status, search } = getTaskFilter;

        const query = await this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        return query.getMany();
    }

    async createTaskAsync(createTask: CreateTaskDto, user: User): Promise<Task> {
        const task = new Task();
        task.title = createTask.title;
        task.description = createTask.description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        delete task.user;
        return task;
    }

}
