import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { obtenerNotaPorId } from "../services/notas";

function Nota() {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [frase, setFrase] = useState('');

  const { id } = useParams<{ id: string }>();

  const notaId = parseInt(id || '0', 10);

  useEffect(() => {
    const cargarNota = async () => {
      try {
        const data = await obtenerNotaPorId(notaId);
        const nota = data.body[0];
        setTitulo(nota.titulo);
        setFrase(nota.frase);
        setTexto(nota.texto);
      } catch (error) {
        console.error('Error al cargar la nota', error);
      }
    };

    cargarNota();
  }, [notaId]);

  return (
    <>
      <div className="max-w-screen-lg mx-auto py-10 px-5 min-h-screen relative">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-cyan-500 mb-5">
            {titulo}
          </h1>
          <p className="text-xl italic text-gray-700 dark:text-white">
            "{frase}"
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
          <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
            <p>{texto}</p>
          </div>
        </div>

        <div className="absolute bottom-5 left-0 w-full text-center">
          <a href="/notas" className="px-4 py-3 bg-cyan-500 text-white font-semibold rounded-md shadow-md hover:bg-cyan-600 transition-all">
            Volver a Notas
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Nota