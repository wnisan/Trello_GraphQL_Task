import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title: string = "";

    @Column()
    description: string = "";

    @ManyToOne(() => User, user => user.project)
    user!: User;

    @OneToMany(() => Task, task => task.project)
    tasks: Task[] = [];
}