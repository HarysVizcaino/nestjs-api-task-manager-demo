import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.tdo';
import { GetTaskFilters } from './dto/get-task-filters.tdo';
import { TaskStatus } from './task.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}
    // private tasks: Task[] = [];

    // getTasks(): Task[] {
    //     return this.tasks;
    // }

    async createTask(createTask: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTaskAsync(createTask, user);
    }


    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

        if ( !found ) {
            throw new NotFoundException(`Task with ID ${id} Not Found`);
        }
        return found;
    }

    async deleteTaskById(id: number, user: User): Promise<void> {

        const result = await this.taskRepository.delete({ id, userId: user.id });

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} Not Found`);
        }
    }

   async updatedTaskStatus(
       id: number,
       status: TaskStatus,
       user: User,
       ): Promise<Task> {
        const task  = await this.getTaskById(id, user);
        task.status = status;
        task.save();
        return task;
    }

   async getTasks(getTaskFilters: GetTaskFilters, user: User): Promise<Task[]> {
        return this.taskRepository.getQueryTask(getTaskFilters, user);
    }
}
