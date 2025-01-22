import { useEffect, useState } from "react";
import Avatar from '../assets/Avatar.svg';
import { useDarkMode } from "@/interfaces/DarkMode";
function Carrusel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const {isDarkMode} = useDarkMode()
  
    const carouselNotes = [
        { title: "Machine Learning", text: "Ana Silva compartió su modelo para predecir datos con Python." },
        { title: "UI Animations", text: "Ricardo Gómez enseñó a usar framer-motion para transiciones fluidas." },
        { title: "Seguridad Web", text: "Gabriel Pérez explicó cómo proteger aplicaciones contra ataques comunes." },
        { title: "Desarrollo Backend", text: "Andrés Velázquez presentó una API REST con NestJS y MySQL." },
        { title: "Testing", text: "Carla Fernández compartió herramientas para realizar pruebas automatizadas." },
        { title: "Microservicios", text: "Marcos Jiménez habló sobre cómo implementar microservicios con Express." },
      ];
      const moveCarousel = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselNotes.length);
      };
    
      useEffect(() => {
        const interval = setInterval(moveCarousel, 3000); // Cambiar cada 3 segundos
        return () => clearInterval(interval); // Limpiar intervalo al desmontar
      }, []);

    return (
    <>
        <h3 className="text-2xl font-bold my-5">Carrusel de Notas Recomendadas</h3>
      <div className="relative">
        {carouselNotes.map((note, index) => (
          <div
            key={index}
            className={`motion-preset-slide-right  p-6 shadow-md rounded-lg box-border my-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${
              index === currentIndex ? 'block' : 'hidden'
            }`}
          >
            <h3 className="text-xl font-bold mb-4">{note.title}</h3>
            <div className="flex items-center gap-4">
              <img src={Avatar} alt="User Avatar" className="w-12 h-12 rounded-full" />
              <p className="text-sm">{note.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>  
    )  
}

export default Carrusel