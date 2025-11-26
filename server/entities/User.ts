import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Project } from "./Project";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstname: string = "";

    @Column()
    lastname: string = "";

    @Column()
    email: string = "";

    @OneToMany(() => Project, project => project.user)
    project: Project[] = [];
}