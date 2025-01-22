import { useEffect, useState } from 'react';
import { obtenerNotaPorId, actualizarNota } from '../services/notas';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';

const EditarNota = () => {
  const { id } = useParams<{ id: string }>();

  const notaId = parseInt(id || '0', 10);

  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [frase, setFrase] = useState('');
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' } | null>(null);

  useEffect(() => {
    const cargarNota = async () => {
      try {
        const data = await obtenerNotaPorId(notaId);
        const nota = data.body[0];
        setTitulo(nota.titulo);
        setFrase(nota.frase);
        setTexto(nota.texto);
      } catch (error) {
        console.error('Error al cargar nota:', error);
      }
    };

    cargarNota();
  }, [notaId]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !frase.trim() || !texto.trim()) {
      mostrarMensaje('Por favor, completa todos los campos.', 'error');
      return;
    }

    try {
      await actualizarNota(notaId, { titulo, frase, texto });
      mostrarMensaje('Nota actualizada con éxito', 'exito');
    } catch (error) {
      console.error('Error al actualizar nota:', error);
      mostrarMensaje('Ocurrió un error al actualizar la nota.', 'error');
    }
  };

  const mostrarMensaje = (texto: string, tipo: 'error' | 'exito') => {
    setMensaje({ texto, tipo });
    setTimeout(() => {
      setMensaje(null);
    }, 5000);
  };

  return (
    <>
      <div className='max-w-screen-lg mx-auto px-2 h-screen '>
        <h1 className='text-3xl font-bold my-8'>Editar Nota ✍️</h1>

        {mensaje && (
          <div
            className={`p-3 mb-5 rounded text-center font-semibold ${
              mensaje.tipo === 'exito' ? 'bg-green-600 text-white motion-preset-confetti ' : 'bg-red-600 text-white  motion-preset-fade '
            }`}
          >
            {mensaje.texto}
          </div>
        )}
        <form onSubmit={manejarSubmit}>
          <input
            id='titulo-nota'
            type="text"
            placeholder="Título de la Nota"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={`w-full block px-3 py-2 border rounded mb-5 outline-none`}
          />
          
          <input
            id='frase-nota'
            type="text"
            placeholder="Frase"
            value={frase}
            onChange={(e) => setFrase(e.target.value)}
            className={`w-full block px-3 py-2 border rounded mt-5 outline-non`}
          />

          <textarea
            id='contenido-nota'
            placeholder="Contenido"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className={`w-full h-80 min-h-[350px] px-3 py-2 my-5 border rounded outline-none`}
          />
          <div className='text-right'>
            <button type="submit" className='px-3 py-2 bg-cyan-500 rounded hover:bg-cyan-600 transition-colors text-white font-semibold mr-1'>Guardar</button>
            <button type='button' className='px-3 py-2 bg-green-600 hover:bg-green-700 transition-colors rounded text-white font-semibold ml-1'>Compartir</button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditarNota;
