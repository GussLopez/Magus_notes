import { useState } from "react"
import Footer from "../components/Footer"
import { crearMensaje } from "../services/notas"

function Soporte() {
    const [correo, setCorreo] = useState('')
    const [mensajeSoporte, setMensajeSoporte] = useState('')
    const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' } | null>(null);

    const manejarSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!correo.trim() || !mensajeSoporte.trim()) {
            mostrarMensaje('Por favor, completa todos los campos.', 'error');
            return;
        }
        try {
            await crearMensaje({ correo, mensajeSoporte })
            mostrarMensaje('Mensaje enviado correctamente', 'exito');
            setCorreo('');
            setMensajeSoporte('');
        } catch (error) {
            console.error('Ocurrio un error', error);
            mostrarMensaje('Ocurrio un error al enviar el mensaje', 'error');
        }
    };

    const mostrarMensaje = (texto: string, tipo: 'error' | 'exito') => {
        setMensaje({ texto, tipo });
        setTimeout(() => {
            setMensaje(null);
        }, 5000);
    }

    return (
        <>
            <main>
                <div className="max-w-screen-lg mx-auto px-2 h-screen">
                    <h1 className="text-center text-3xl font-semibold my-5">Contáctanos!</h1>
                    <div className="max-w-[500px] mx-auto box-border border shadow-md p-10 rounded bg-white dark:bg-gray-800 dark:border-0">

                        <form onSubmit={manejarSubmit} action="" className="flex flex-col gap-1">
                            <label htmlFor="soporte-email" className="text-lg font-semibold">Correo</label>
                            <input
                                type="email"
                                id="soporte-email"
                                placeholder="ejemplo@gmail.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                className="px-3 py-2 rounded outline-none border focus:ring-2 focus:ring-gray-500 mb-7"
                            />
                            <label htmlFor="soprote-mensaje" className="text-lg font-semibold">Mensaje</label>
                            <textarea
                                name=""
                                id="soprote-mensaje"
                                placeholder="En que te podemos ayudar?"
                                value={mensajeSoporte}
                                onChange={(e) => setMensajeSoporte(e.target.value)}
                                className="px-3 py-2 rounded min-h-[300px] outline-none border focus:ring-2 focus:ring-gray-500"
                            ></textarea>
                            {mensaje && (
                                <div className={`p-3 my-5 rounded text-center font-semibold ${mensaje.tipo === 'exito' ? 'bg-green-600 text-white motion-preset-confetti ' : 'bg-red-600 text-white'
                                    }`}
                                >
                                    {mensaje.texto}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors mt-5 font-semibold"
                            >Enviar</button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Soporte