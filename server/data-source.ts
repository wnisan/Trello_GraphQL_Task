import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Project } from "./entities/Project";
import { Task } from "./entities/Task";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "WNISAN", 
  port: 1433, 

  database: "TrelloApp",
  username: "ulyanakost", 
  password: "1111", 

  synchronize: true,
  logging: true,
  entities: [User, Project, Task],
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

