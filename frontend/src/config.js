// En desarrollo: http://localhost:4000
// En producción: el frontend y backend están en el mismo servidor, usamos ruta relativa ''
export const API_URL = import.meta.env.DEV ? 'http://localhost:4000' : '';
