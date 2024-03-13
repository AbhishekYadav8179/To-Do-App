import { Injectable, WritableSignal, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from '@capacitor-community/sqlite';


const DB_USERS='myuserdb';

export interface User{
  id:number;
  name:string;
  email:string;
  phoneNumber:string;
  password:string;
}

export interface Task{
  taskId:number;
  taskName:string;
  taskPriority:string;
  taskDescription:string;
  taskStatus:string;
  userId:number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  private sqlite: SQLiteConnection= new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private users:WritableSignal<User[]> = signal<User[]>([]);

  public tasks:Task[]=[];
 // public tasks:WritableSignal<Task[]>=signal<Task[]>([]);

  public loginUserId:number=0;


  constructor() { }

  getUsers(){
    return this.users;
  }

  getTasks(){
    return this.tasks;
  }

  async initializePlugin(){

    console.log("Came");
    this.db = await this.sqlite.createConnection(
      DB_USERS,false,'no-encryption',1,false
      );

      await this.db.open();

      console.log("Open");
      const schema=`CREATE TABLE IF NOT EXISTS user(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );`

      const schema1=`CREATE TABLE IF NOT EXISTS task(
        taskId INTEGER PRIMARY KEY AUTOINCREMENT,
        taskName TEXT NOT NULL,
        taskPriority TEXT NOT NULL,
        taskDescription TEXT NOT NULL,
        taskStatus TEXT NOT NULL,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES user(id)
      )`;

      await this.db.execute(schema);
      await this.db.execute(schema1);
      console.log("TABLE CREATED");
      this.loadUsers();
  }

  async loadUsers(){
    const users= await this.db.query('SELECT * FROM user;');
    this.users.set(users.values ||[]);
  }

  async loadTasks(){
    console.log("LOAD TASKS USER ID:",this.loginUserId);
    const query=`SELECT * FROM task WHERE userId=${this.loginUserId} ORDER BY taskId DESC`;
    const taskst=await this.db.query(query);
    console.log("QUERY TASK LIST:",taskst);
    this.tasks = taskst.values as Task[];
    console.log("LOAD Tasks:", this.tasks);
    // return this.tasks;
    //this.tasks.set(tasks.values  ||[]);
  }

  async addUser(name:string,email:string,phoneNumber:string,password:string){
    
    const query=`INSERT INTO user (name,email,phoneNumber,password) VALUES ("${name}","${email}","${phoneNumber}","${password}")`;
    console.log("USER: ",query);
    const result= await this.db.execute(query);

    // const query = 'INSERT INTO user (name, email, phoneNumber, password) VALUES (?, ?, ?, ?)';
    // const result = await this.db.query(query, [name, email, phoneNumber, password]);


    this.loadUsers();
    return result;
  }

  async updateUserById(id:number,name:string,email:string,phoneNumber:string,password:string){
    const query=`UPDATE user SET name="${name}",email="${email}",phoneNumber="${phoneNumber}",password="${password}" WHERE id=${id}`;
    const result=await this.db.query(query);

    this.loadUsers();

    return result;

  }

  async deleteUserById(id:number){
    const query=`DELETE FROM user  WHERE id=${id}`;
    const result=await this.db.query(query);

    this.loadUsers();

    return result;

  }

  async loginUser(email:string,password:string){
    const query=`SELECT email,password FROM user WHERE email="${email}" AND password="${password}"`;
    console.log("LOGIN")
    const result=await this.db.query(query);
    console.log("Resylt of login:",result.values);


    const query1=`SELECT id FROM user WHERE email="${email}" AND password="${password}"`;
    const result1=await this.db.query(query1);
    console.log("LOGINID:",result1)
    if(result1?.values){
      this.loginUserId= result1?.values[0]?.id || -1;
    }
    console.log("AFTER:LOGIN ID:",this.loginUserId);

    this.loadUsers();
    return result;
  }

  async addTask(taskName:string,taskPriority:string,taskDescription:string,taskStatus:string,userId:number){
    const query=`INSERT INTO task (taskName,taskPriority,taskDescription,taskStatus,userId) VALUES ("${taskName}","${taskPriority}","${taskDescription}","${taskStatus}",${userId})`;

    console.log("Task: ",query);


    const result= await this.db.execute(query);
    console.log("Insert res: ", result);

    // const query1=`SELECT * FROM task`;
    // console.log("TASKS:",query1);

    // const result1=await this.db.query('SELECT * FROM task');

    // console.log("select task res: ",result1);
    this.loadTasks();
    return result;

  }

  async changeTaskStatus(task:Task){
    const status='Completed';
    const query=`UPDATE task SET taskStatus="${status}" WHERE taskId=${task.taskId}`;
    const result=await this.db.query(query);
    this.loadTasks();
    return result;

  }

  async deleteTaskById(task:Task){
    const query=`DELETE FROM task WHERE taskId=${task.taskId}`;
    const result=await this.db.query(query);
    this.loadTasks();
    return result;
  }

  async updateTaskById(id:number,newTaskName:string,newTaskPriority:string,newTaskDescription:string){
    const query=`UPDATE task SET taskName="${newTaskName}",taskPriority="${newTaskPriority}",taskDescription="${newTaskDescription}" WHERE taskId=${id}`;
    const result=await this.db.query(query);

    this.loadTasks();

    return result;
  }
}
