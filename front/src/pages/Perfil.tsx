import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useDarkMode } from "@/interfaces/DarkMode";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarioPorId } from "@/services/auth";

interface PerfilProps {
  userId: string | null;
}

interface Favorito {
  id: number;
  titulo: string;
  texto: string;
}

function Perfil({ userId }: PerfilProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const data = await obtenerUsuarioPorId(userId);
        const user = data.body[0];
        setNombre(user.nombre);
        setApellido(user.apellido);
        setEmail(user.correo);
        setTelefono(user.telefono);
      } catch (error) {
        console.error("Error al obtener los datos del usuario", error);
      }
    };
    obtenerUsuario();
  }, [userId]);

  useEffect(() => {
    const savedFavoritos = localStorage.getItem("favoritos");
    if (savedFavoritos) {
      setFavoritos(JSON.parse(savedFavoritos));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleEditUser = () => {
    setShowModal(true);
  };

  const saveUserData = () => {
    const updatedUser = { nombre, apellido, correo: email, telefono };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowModal(false);
  };

  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días ☀️";
    if (hora < 18) return "Buenas tardes 🌤️";
    return "Buenas noches 🌙";
  };

  return (
    <>
      <div
        className={`min-h-screen ${
          isDarkMode ? "dark:bg-gray-900" : "bg-gray-100"
        } p-4 sm:p-6 md:px-8 md:py-3`}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          {getSaludo()}, {nombre}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div
            className={`${
              isDarkMode ? "dark:bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-4 sm:p-6`}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-200 rounded-full mb-4 flex justify-center items-center">
                <p className="text-white font-semibold text-5xl">
                  {nombre.slice(0, 1)}
                </p>
              </div>
              <h2
                className={`text-xl sm:text-2xl font-semibold ${
                  isDarkMode ? "dark:text-white" : "text-gray-800"
                }`}
              >
                {nombre} {apellido}
              </h2>
              <span
                className={`text-sm ${
                  isDarkMode ? "dark:text-gray-400" : "text-gray-500"
                }`}
              >
                Subscriber
              </span>
            </div>

            <div className="space-y-2 text-md my-4">
              <p>
                <strong>Nombre:</strong> {nombre}
              </p>
              <p>
                <strong>Apellido:</strong> {apellido}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Teléfono:</strong> +55 {telefono}
              </p>
            </div>

            <div className="flex space-x-4 mt-4 sm:mt-6">
              <button
                onClick={handleEditUser}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm font-semibold bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Favoritos */}
          <div className="col-span-1 lg:col-span-3 space-y-6 sm:space-y-8">
            <div
              className={`${
                isDarkMode ? "dark:bg-gray-800" : "bg-white"
              } rounded-lg shadow-md p-4 sm:p-6`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Favoritos
              </h3>
              {favoritos.length > 0 ? (
                <div className="space-y-4">
                  {favoritos.map((favorito) => (
                    <div
                      key={favorito.id}
                      className={`p-4 rounded-md ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <h4
                        className={`font-bold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {favorito.titulo}
                      </h4>
                      <p
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        {favorito.texto}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                >
                  No tienes notas favoritas aún.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className={`${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } rounded-lg p-6 w-96`}
          >
            <h2 className="text-xl font-bold mb-4">Editar Información</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Teléfono"
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={saveUserData}
                className="px-4 py-2 bg-cyan-500 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Perfil;
