import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid'
import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';
import { Lesson } from './lesson.entity';
import { CreateLessonInput } from './lesson.input';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson) private lessonRespository: Repository<Lesson>
    ) {}

    async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
        const { name, startDate, endDate, students } = createLessonInput
        const lesson = this.lessonRespository.create({
            id: uuid(),
            name,
            startDate,
            endDate,
            students
        })

        return this.lessonRespository.save(lesson)
    }

    async getLesson(id: string): Promise<Lesson> {
        return this.lessonRespository.findOne({ id: id})
    }

    async getAllLessons(): Promise<Lesson[]> {
        return this.lessonRespository.find()
    }

    async assignStudentsToLesson(assignStudentsToLessonInput: AssignStudentsToLessonInput): Promise<Lesson> {
        const { lessonId, studentIds } = assignStudentsToLessonInput
        const lesson = await this.lessonRespository.findOne({ id: lessonId})
        lesson.students = [...lesson.students, ...studentIds]
        return this.lessonRespository.save(lesson)
    }
}
