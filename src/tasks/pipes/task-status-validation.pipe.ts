import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task.enum';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.DONE,
        TaskStatus.INPROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: string) {
        value = value.toUpperCase();
        if (!this.isStatusValid(status)) {
            throw new BadRequestException(`${value} is a invalid status`);
        }

        return value;

    }

    private isStatusValid(status: any) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}
