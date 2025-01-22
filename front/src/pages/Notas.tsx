import { useEffect, useRef, useState } from 'react';
import { eliminarNota, obtenerNotas } from '../services/notas';
import Footer from '../components/Footer';
import { useDarkMode } from "../interfaces/DarkMode";
import DropDown from '../components/DropDown';
import Modal from '../components/Modal';
import { MagnifyingGlass, NotePencil, Plus, Trash, X } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import SideBarIcon from '@/components/SideBar';
interface NotasProps {
  userId: string | null;
}
const Notas = ({userId}: NotasProps) => {
  const { isDarkMode } = useDarkMode();
  const [notas, setNotas] = useState<{ id: number; titulo: string; texto: string; frase: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null)
  const [filtrar, setFiltrar] = useState([]);
  const [buscador, setBuscador] = useState<string>('')
  const [fraseDia, setFraseDia] = useState(true)
  const footerRef = useRef<HTMLDivElement>(null);
  const [iconFixed, setIconFixed] = useState(true);
  
  useEffect(() => {
    const cargarNotas = async () => {
      try {
        const data = await obtenerNotas();
        setNotas(data);
        setFiltrar(data);
      } catch (error) {
        console.error('Error al obtener notas:', error)
      }
    };
    cargarNotas();
  }, []);

  useEffect(() => {
    if (buscador.trim() === '') {
      setFiltrar(notas)
    } else {
      const lowerCase = buscador.toLowerCase();
      setFiltrar(
        notas.filter(item => item.titulo?.toLowerCase().includes(lowerCase))
      )
    }
  }, [buscador, notas]);
  const manejarEliminar = async () => {
    if (!notaSeleccionada) return;
    try {
      await eliminarNota(notaSeleccionada.id);
      setNotas(notas.filter(nota => nota.id !== notaSeleccionada.id));
      setFiltrar(filtrar.filter(nota => nota.id !== notaSeleccionada.id))
      setOpen(false)
      setNotaSeleccionada(null)
    } catch (error) {
      console.error('Error al eliminar la nota', error);
    }
  }
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIconFixed(!entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  const abrirModal = (nota) => {
    setNotaSeleccionada(nota);
    setOpen(true);
  };


  return (
    <>
      <div className='max-w-screen-lg mx-auto px-2 min-h-screen mb-96'>
        {
          fraseDia && (
            <div className="bg-cyan-500 text-white rounded-md p-5 shadow my-10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-3">Frase Inspiradora del Día 🌟</h2>
                <p className="italic text-lg">"{notas[0]?.frase || 'Escribe tu primera frase inspiradora para compartir con otros.'}"</p>
              </div>
              <div>
                <button onClick={() => setFraseDia(false)} className='hover:bg-cyan-600 rounded-full p-1 transition-all'><X weight='bold' size={20} /></button>
              </div>
            </div>
          )
        }
        <div className={`md:flex md:justify-between box-border px-5 py-3 my-10 rounded-md md:items-center`}>
          <h1 className="text-4xl font-bold mb-10 text-center md:mb-0 md:text-start">Mis Notas 🗒️</h1>

          <div className="relative flex">
            <input
              type="search"
              id="search-notas"
              className={`block w-full h-[40px] sm:h-[45px] rounded-md shadow-md outline-none pl-12 pr-4 text-sm sm:text-base ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                } focus:ring-2 focus:ring-cyan-500`}
              placeholder="Buscar Nota"
              onChange={(e) => setBuscador(e.target.value)}
            />
            <MagnifyingGlass size={32} weight='bold' className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500`} />
          </div>
        </div>
        {filtrar.length === 0 ? (
          <div className="text-center mt-20">
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              No hay notas disponibles. ¡Crea tu primera nota ahora! 📒
            </p>
            <Link
              to="/crearNota"
              className="mt-5 inline-block px-4 py-2 bg-cyan-500 text-white rounded-md font-semibold hover:bg-cyan-600 transition-colors"
            >
              Crear Nota
            </Link>
          </div>
        ) : (
          <ul className='md:grid md:grid-cols-2 md:gap-5'>
            {filtrar.map((nota) => (
              <li className='mb-10' key={nota.id}>
                <div className={`p-5 shadow rounded-md box-border my-8 md:my-0 dark:bg-gray-800 bg-white h-[300px]`}>
                  <div className="flex justify-between">
                    <h3 className="font-bold text-2xl mb-5">{nota.titulo}</h3>
                    <DropDown nota={nota} onOpenModal={abrirModal}/>
                  </div>
                  <Link to={`/notas/nota/${nota.id}`} className='hover:scale-105 transition-all'>
                    <p className='italic font-thin'>"{nota.frase}"</p>
                    <div className="flex gap-5 box-border">
                      <div>
                        <p className="my-5 md:h-[70px]">
                          {nota.texto.length > 100
                            ? `${nota.texto.slice(0, 100)}...`
                            : nota.texto}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </Link>
                  <div className="flex justify-between mt-5 px-5">
                    <Link to={`/notas/editarNota/${nota.id}`} className='btn bg-green-500 text-white hover:bg-green-600 transition-colors'>
                      <NotePencil size={22}/>
                      Editar
                    </Link>
                    <button
                      className='btn btn-danger'
                      onClick={() => {
                        setNotaSeleccionada(nota);
                        setOpen(true);
                      }}
                    >
                      <Trash weight="fill" />
                      Eliminar
                    </button>
                  </div>
                  <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="text-center md:w-[350px]">
                      <Trash weight="fill" size={56} className='mx-auto text-red-500' />
                      <div className="mx-auto my-4 w-48">
                        <h3 className="text-4xl font-black text-gray-800 mb-3">Eliminar Nota</h3>
                        <p className="text-m text-gray-500">¿Estás seguro de que deseas eliminar esta nota?</p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          className="btn w-full text-red-500 border-red-500 border-2 hover:bg-red-500 hover:text-white transition-colors"
                          onClick={manejarEliminar}
                        >
                          Eliminar
                        </button>
                        <button className="btn btn-light w-full" onClick={() => setOpen(false)}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              </li>
            ))}
        <a
          href="/crearNota"
          className={`left-0 right-0 ${iconFixed ? 'fixed bottom-5' : 'absolute bottom-auto'}`}
          style={{
            transition: 'position 0.3s',
          }}
        >
          <SideBarIcon icon={<Plus size={32} />} text='Crear Nota ⚡' />
        </a>
          </ul>
        )}
      
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
};
export default Notas;