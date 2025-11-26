import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Project } from "./Project";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title: string = "";

  @Column()
  description: string = "";

  @Column({ default: "TODO" })
  status: string = "TODO";

  @ManyToOne(() => Project, project => project.tasks)
  project!: Project;
}