import { useState } from 'react';
import Avatar from '../assets/Avatar.svg';
import { useDarkMode } from '../interfaces/DarkMode';

function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <>
      <div className={`box-border h-[300px] bg-gray-600 dark:bg-gray-700 pt-10`}>
        <h1 className="font-bold text-3xl text-center motion-preset-typewriter-[25] motion-duration-[7s] mx-auto text-white">
          Busca Cualquier tema...
        </h1>
        <div className="relative w-full max-w-[90%] sm:max-w-[400px] mt-10 mx-auto">
          <input
            id="home-search"
            type="search"
            className={`block w-full h-[40px] sm:h-[45px] rounded-lg shadow-lg outline-none pl-12 pr-4 text-sm sm:text-base bg-white dark:bg-white dark:text-gray-700 focus:ring-2 focus:ring-cyan-500`}
            placeholder="Buscar..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <svg
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </div>
      </div>
      <div className="custom-shape-divider-top-1733114191">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill text-gray-600 dark:text-gray-700"
            fill="currentColor"
            fillOpacity="1"
          ></path>
        </svg>
      </div>
    </>
  );
}

function Quotes() {
  const { isDarkMode } = useDarkMode();
  const [query, setQuery] = useState('');

  const notes = [
    { title: "Gestión Ágil", text: "Sofía Díaz mostró cómo usar Scrum en proyectos personales." },
    { title: "Base de Datos", text: "Pedro Martínez explicó cómo diseñar esquemas eficientes en MySQL." },
    { title: "Clean Code", text: "Laura Hernández compartió buenas prácticas para escribir código limpio." },
    { title: "Productividad", text: "Diego Torres dio consejos sobre manejo del tiempo en tareas complejas." },
    { title: "Automatización", text: "Isabela Ruiz habló sobre scripts para automatizar tareas cotidianas." },
    { title: "Frontend Avanzado", text: "Luis Sánchez mostró cómo usar Tailwind CSS para aplicaciones dinámicas." },
    { title: "Machine Learning", text: "Ana Gutiérrez compartió cómo empezar en Machine Learning usando Python." },
    { title: "Ciberseguridad", text: "Mario López explicó cómo proteger datos personales en línea." },
  ];

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.text.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <SearchBar onSearch={setQuery} />

      <div className="space-y-10">
      <div className='max-w-screen-lg mx-auto py-2'>
        <h2
          className={`text-3xl font-bold my-10 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          Compartido por Otros Usuarios
        </h2>
        <div className="md:grid md:grid-cols-2 md:gap-8">
          {filteredNotes.map((note, index) => (
            <div
              key={index}
              className={`motion-preset-slide-right p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 my-8 md:my-0 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white'
                  : 'bg-gradient-to-br from-white to-gray-100 text-gray-800'
              }`}
            >
              <h3 className="font-bold text-2xl mb-5 border-b pb-2">{note.title}</h3>
              <div className="flex gap-5 items-center">
                <div className="flex-shrink-0">
                  <img
                    src={Avatar}
                    alt="User image"
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                </div>
                <div>
                  <p className="font-semibold text-xl mb-2">{note.title}</p>
                  <p className="text-lg font-light italic">{note.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export default Quotes;
