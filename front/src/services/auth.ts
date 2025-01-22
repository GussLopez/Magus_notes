import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // URL del backend
});

export const login = async (correo: string, password: string) => {
  const response = await api.post('/api/usuarios/login', { correo, password });
  return response.data;
};

export const register = async (nombre: string, apellido: string, correo: string, telefono: string, password: string) => {
  const response = await api.post('/api/usuarios', { nombre, apellido, correo, telefono, password });
  return response.data;
};

export const obtenerUsuarioPorId = async (id: string) => {
  const response = await api.get(`api/usuarios/${id}`);
  return response.data;
}