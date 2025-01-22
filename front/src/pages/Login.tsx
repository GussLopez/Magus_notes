import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Notification from '../components/Notification'
import Logo from "../assets/logoMagus.svg"
import note from "../assets/note.svg"
import { Sun, Moon, Eye, EyeOff } from 'lucide-react'
import { useDarkMode } from '@/interfaces/DarkMode'
interface AuthSliderProps {
  initialMode?: 'login' | 'register'
}
export default function AuthSlider({ initialMode = 'login' }: AuthSliderProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/')
    }
  }, [navigate])
  const validateEmail = (correo: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(correo)
  }
  const validatePassword = (password: string) => {
    return password.length >= 8
  }
  const validatePhone = (telefono: string) => {
    const re = /^\d{10}$/
    return re.test(telefono)
  }
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    if (isLogin) {
      if (!validateEmail(correo)) {
        showNotification("Por favor, ingrese un correo electrónico válido", "error")
        setIsLoading(false)
        return
      }
      if (!validatePassword(password)) {
        showNotification("La contraseña debe tener al menos 8 caracteres", "error")
        setIsLoading(false)
        return
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, {
          correo,
          password
        })
        if (response.data && response.data.body && response.data.body.token) {
          localStorage.setItem('token', response.data.body.token)
          showNotification("Inicio de sesión exitoso", "success")
          navigate('/')
        } else {
          showNotification("No se pudo iniciar sesión. Por favor, verifique sus credenciales.", "error")
        }
      } catch (error) {
        console.error('Login error:', error)
        if (axios.isAxiosError(error) && error.response) {
          showNotification(error.response.data.body || "Error al iniciar sesión", "error");
        } else {
          showNotification("Error al conectar con el servidor", "error");
        }
      }
    } else {
      if (!nombre || !apellido || !correo || !telefono || !password) {
        showNotification("Por favor, llene todos los campos", "error")
        setIsLoading(false)
        return
      }
      if (!validateEmail(correo)) {
        showNotification("Por favor, ingrese un correo electrónico válido", "error")
        setIsLoading(false)
        return
      }
      if (!validatePassword(password)) {
        showNotification("La contraseña debe tener al menos 8 caracteres", "error")
        setIsLoading(false)
        return
      }
      if (!validatePhone(telefono)) {
        showNotification("Por favor, ingrese un número de teléfono válido (10 dígitos)", "error")
        setIsLoading(false)
        return
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
          nombre,
          apellido,
          correo,
          telefono,
          password
        })
        if (response.status === 201) {
          showNotification("Registro exitoso. Redirigiendo al inicio de sesión...", "success")
          setTimeout(() => {
            setIsLogin(true)
            setCorreo('')
            setPassword('')
            setNombre('')
            setApellido('')
            setTelefono('')
          }, 3000)
        } else {
          showNotification("No se pudo completar el registro. Por favor, intente de nuevo.", "error")
        }
      } catch (error) {
        console.error('Registration error:', error)
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            showNotification("Este correo electrónico ya está registrado. Intenta con otro.", "error")
          } else if (error.response?.data?.message) {
            showNotification(error.response.data.message, "error")
          } else {
            showNotification("No se pudo completar el registro. Por favor, intente de nuevo.", "error")
          }
        } else {
          showNotification("Ocurrió un error inesperado. Por favor, intente de nuevo.", "error")
        }
      }
    }
    setIsLoading(false)
  }
  const toggleMode = () => {
    setIsLogin(prev => !prev)
  }
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 py-8">
      <div className='w-full max-w-screen-xl mx-auto px-2 flex justify-center'> 
        <div className="w-full min-w-[50vw] max-w-[90vw] md:h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl md:overflow-hidden flex relative mx-auto"> 
          <button
            className="absolute top-5 right-5 z-10 hover:bg-gray-200 md:hover:bg-cyan-600 p-2 rounded-full transition-colors"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5 text-cyan-500 md:text-white' />}
          </button>
          <div className="relative w-full h-full md:flex md:overflow-hidden">
            <div className="w-full h-full md:flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${isLogin ? '0%' : '-50%'})` }}>
              <div className="md:w-1/2 min-w-[50%] p-12 flex flex-col justify-center items-center text-center">
                <img src={Logo} alt="Magus Notes Logo" className="mb-4 w-24 h-24 motion-scale-in-[0.5] motion-translate-x-in-[-120%] motion-translate-y-in-[-60%] motion-opacity-in-[33%] motion-rotate-in-[-1080deg] motion-blur-in-[10px] motion-delay-[0.38s]/scale motion-duration-[0.38s]/opacity motion-duration-[1.20s]/rotate motion-duration-[0.15s]/blur motion-delay-[0.60s]/blur motion-ease-spring-bouncier" />
                <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Magus Notes</h2>
                <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Iniciar Sesión</h3>
                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
                  <div>
                    <label htmlFor="login-email" className="text-left block mb-1">Correo Electrónico</label>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="login-password" className="text-left block mb-1">Contraseña</label>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-2 top-[38px] flex items-center text-sm"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Cargando...
                      </div>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </form>
                <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                  <a href="/reset-password" className="hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
              </div>
              <div className="md:w-1/2 min-w-[50%] p-12 flex flex-col justify-center items-center text-center">
                <img src={Logo} alt="Magus Notes Logo" className="mb-4 w-24 h-24" />
                <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Magus Notes</h2>
                <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Registrarse</h3>
                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
                  <div>
                    <label htmlFor="register-name" className="text-left block mb-1">Nombre</label>
                    <input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="register-lastname" className="text-left block mb-1">Apellido</label>
                    <input
                      id="register-lastname"
                      type="text"
                      placeholder="Tu apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="register-email" className="text-left block mb-1">Correo Electrónico</label>
                    <input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="register-phone" className="text-left block mb-1">Teléfono</label>
                    <input
                      id="register-phone"
                      type="tel"
                      placeholder="Tu número de teléfono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="register-password" className="text-left block mb-1">Contraseña</label>
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="relative w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-2 top-[38px] flex items-center text-sm"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Cargando...
                      </div>
                    ) : (
                      'Registrarse'
                    )}
                  </button>
                </form>
              </div>
            </div>
            <div 
              className={`hidden md:absolute top-0 bottom-0 w-1/2 bg-cyan-500 text-white p-12 md:flex flex-col justify-center items-center transition-transform duration-500 ease-in-out ${
                isLogin ? 'md:right-0' : 'translate-x-full'
              }`}
            >
              <img src={note} alt="Nota decorativa" className="mb-8 w-48 h-48" />
              <h2 className="text-3xl font-bold mb-6 text-center">
                {isLogin ? '¿Eres nuevo aquí?' : '¿Ya tienes una cuenta?'}
              </h2>
              <p className="text-lg mb-8 text-center">
                {isLogin ? 'Regístrate y comienza tu viaje con nosotros' : 'Inicia sesión para continuar tu experiencia'}
              </p>
              <button
                onClick={toggleMode}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-cyan-500 font-bold py-2 px-4 rounded-md transition duration-300"
              >
                {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}

