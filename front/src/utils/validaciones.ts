// utils/validaciones.ts
interface ReglasValidacion {
    [campo: string]: (valor: string) => string | null;
  }
  
  export const validarCampos = (
    datos: { [key: string]: string },
    reglas: ReglasValidacion
  ): { [key: string]: string } => {
    const errores: { [key: string]: string } = {};
    Object.keys(reglas).forEach((campo) => {
      const error = reglas[campo](datos[campo]);
      if (error) errores[campo] = error;
    });
    return errores;
  };
  