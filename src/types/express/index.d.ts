import { UserInterface } from '../../interfaces'; // Ajusta la ruta

// Le decimos a TypeScript que module Express
// y agregue nuestra propiedad 'user' al tipo 'Request'
declare global {
  namespace Express {
    export interface Request {
      // 3. Añade tu propiedad 'user' al tipo Request
      user?: UserInterface;
    }
  }
}