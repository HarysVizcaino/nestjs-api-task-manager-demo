import { TaskStatus } from '../task.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTaskFilters {
    @IsOptional()
    @IsIn([TaskStatus.DONE, TaskStatus.INPROGRESS, TaskStatus.OPEN])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
