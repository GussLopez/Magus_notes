import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerNotasPublicadas } from '../services/notas';

interface PublishedNote {
  id: number;
  titulo: string;
  frase: string;
  texto: string;
}

const PublishedNotes: React.FC = () => {
  const [publishedNotes, setPublishedNotes] = useState<PublishedNote[]>([]);

  useEffect(() => {
    const fetchPublishedNotes = async () => {
      try {
        const notes = await obtenerNotasPublicadas();
        setPublishedNotes(notes);
      } catch (error) {
        console.error('Error fetching published notes:', error);
      }
    };

    fetchPublishedNotes();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Últimas Notas Publicadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedNotes.map((note) => (
          <Link to={`/notas/nota/${note.id}`} key={note.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{note.titulo}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{note.frase}"</p>
              <p className="text-gray-700 dark:text-gray-200">
                {note.texto.length > 100 ? `${note.texto.slice(0, 100)}... ` : note.texto}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PublishedNotes;