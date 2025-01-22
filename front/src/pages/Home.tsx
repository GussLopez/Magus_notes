import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from "../components/Footer"
import Quotes from "../components/Quotes"
import SearchBar from "../components/SearchBar"
import { jwtDecode } from 'jwt-decode'
import { useUser } from '@/context/UserContext'

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()


    const { setIdUsuario } = useUser();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setIdUsuario(decoded.id); // Guardamos el ID en el contexto
            } catch (error) {
                console.error('Error al decodificar el token:', error);
            }
        }
    }, [setIdUsuario]);


    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        navigate('/login')
    }

    useEffect(() => {
        const userPreference = localStorage.getItem('theme');
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (userPreference === 'dark' || (!userPreference && systemPreference)) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, []);

    return (
        <>
            <main>
                <div className="max-w-screen-lg mx-auto px-2 h-[530px] flex flex-col justify-center items-center gap-8 box-border">
                    <h1 className="text-7xl font-bold text-center motion-preset-flomoji-🚀 ">Magus Notes</h1>
                    <p className="text-2xl font-light text-center">"Toma notas, crea ideas, y nunca dejes de aprender."</p>
                    <div className="flex gap-4">
                        <a href="/crearNota" className="px-3 py-2 bg-cyan-500 rounded-lg font-semibold text-white hover:bg-cyan-600 transition-colors motion-preset-shake">Crear Notas</a>
                        {isLoggedIn && (
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 bg-red-500 rounded-lg font-semibold text-white hover:bg-red-600 transition-colors motion-preset-shake"
                            >
                                Cerrar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </main>
                <Quotes />
            <Footer />
        </>
    )
}

export default Home
