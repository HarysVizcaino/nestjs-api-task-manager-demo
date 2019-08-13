import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilters } from './dto/get-task-filters.tdo';
import { TaskStatus } from './task.enum';
import { CreateTaskDto } from './dto/create-task.tdo';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, username: 'Test User' };
const mockTaskDto: CreateTaskDto = { title: ' Test Task', description: 'Test Task Description' };

const mockTaskRepository = () => ({
    getQueryTask: jest.fn(),
    findOne: jest.fn(),
    createTaskAsync: jest.fn(),
    delete: jest.fn(),
 });

describe('TasksService', () => {
    let tasksServices;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        tasksServices = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {

            taskRepository.getQueryTask.mockResolvedValue('someValue');

            expect(taskRepository.getQueryTask).not.toHaveBeenCalled();
            const filters: GetTaskFilters = { status: TaskStatus.INPROGRESS, search: 'Some search query' };

            const result = await tasksServices.getTasks(filters, mockUser);

            expect(taskRepository.getQueryTask).toHaveBeenCalled();
            expect(result).toEqual('someValue');

        });
    });

    describe('getTasksById', () => {
        it('calls taskRepository.findOne() and succesfully retrieve and return the task', async () => {
            const mockTask = { title: 'Test task', description: 'Test desc' };

            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksServices.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                },
            });

        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksServices.getTaskById(1, mockUser)).rejects.toThrow();
        });
    });

    describe('createTask', () => {
        it('should calls Create task repository with task and user', async () => {

            taskRepository.createTaskAsync.mockResolvedValue('sometask');
            const result = await tasksServices.createTask(mockTaskDto, mockUser);
            expect(taskRepository.createTaskAsync).toHaveBeenCalledWith(mockTaskDto, mockUser);
            expect(result).toEqual('sometask');

        });

    });

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete a task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksServices.deleteTaskById(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        });

        it('throws an error as task coud not be found', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksServices.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', () => {
        it('updates a task status', async () => {
            const save = jest.fn().mockResolvedValue(true);

            tasksServices.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });

            expect(tasksServices.getTaskById).not.toHaveBeenCalled();
            const result = await tasksServices.updatedTaskStatus(1, TaskStatus.DONE, mockUser);
            expect(tasksServices.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});
