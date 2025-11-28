import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Загружаем .env файл из корня проекта
const envPath = path.resolve(process.cwd(), '.env');
const envResult = dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;

// Валидация формата connection string
function validateConnectionString(uri: string): { valid: boolean; error?: string } {
  if (!uri || uri.trim().length === 0) {
    return { valid: false, error: 'Connection string is empty' };
  }

  const mongodbPattern = /^mongodb(\+srv)?:\/\//;
  if (!mongodbPattern.test(uri)) {
    return { 
      valid: false, 
      error: 'Invalid format. Must start with mongodb:// or mongodb+srv://' 
    };
  }

  // Проверка наличия хоста
  const hostPattern = /@([^\/]+)/;
  if (!hostPattern.test(uri)) {
    return { 
      valid: false, 
      error: 'Missing host in connection string' 
    };
  }

  return { valid: true };
}


export const connectDatabase = async (): Promise<void> => {
  try {
    
    // Опции подключения с увеличенными таймаутами
    const connectionOptions: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 15000, // Увеличено до 15 секунд
      socketTimeoutMS: 45000, // Увеличено до 45 секунд
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    };
    
    await mongoose.connect(MONGODB_URI, connectionOptions);
    
    console.log('Database name:', mongoose.connection.db?.databaseName || 'N/A');
    console.log('Host:', mongoose.connection.host || 'N/A');
    console.log('Port:', mongoose.connection.port || 'N/A (SRV)');
    console.log('Ready state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected');
    
    // Обработчики событий подключения
    mongoose.connection.on('error', (err) => {
      console.error(' MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(' MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log(' MongoDB reconnected');
    });

    await initializeDatabase();
    
  } catch (error) {
    console.error('\n MongoDB connection failed!');
    
    if (error instanceof Error) {
      console.error(' Error name:', error.name);
      console.error(' Error message:', error.message);
      
    process.exit(1);
  }
};

async function initializeDatabase() {
  try {
   
    // Даем время на установление соединения
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { User } = await import('../models/User');
    const { Project } = await import('../models/Project');
    const { Task } = await import('../models/Task');
    
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log(' Database is empty, creating sample data...');
      
      const user = await User.create({
        firstname: "Ulyana",
        lastname: "Kostiukevich",
        email: "ulianakost2006@gmail.com"
      });

      const project = await Project.create({
        title: "Trello Task Manager",
        description: "Проект для управления задачами",
        user: user._id
      });

      await Task.create([
        {
          title: "Настроить базу данных",
          description: "Подключение к MongoDB",
          status: "DONE",
          project: project._id
        },
        {
          title: "Развернуть GraphQL API",
          description: "API для работы с задачами",
          status: "IN_PROGRESS",
          project: project._id
        },
        {
          title: "Оптимизировать производительность",
          description: "Улучшение скорости работы",
          status: "TODO",
          project: project._id
        }
      ]);
  
    } 
    
    console.log('Database initialization complete!\n');
    
  } catch (error) {
    console.error(' Warning: Could not initialize database data');
    if (error instanceof Error) {
      console.error('   Error:', error.message);
    }
  }
}
}
