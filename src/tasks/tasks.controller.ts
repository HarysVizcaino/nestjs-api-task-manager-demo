import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.tdo';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task.enum';
import { GetTaskFilters } from './dto/get-task-filters.tdo';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
      @Query(ValidationPipe) filterDto: GetTaskFilters,
      @GetUser() user: User): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
      @Body() createTaskDto: CreateTaskDto,
      @GetUser() user: User,
      ): Promise<Task> {
            return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTaskById(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User,
      ): Promise<void> {
      return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('status')  status: TaskStatus,
      @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.updatedTaskStatus(id, status, user);
    }

 }
