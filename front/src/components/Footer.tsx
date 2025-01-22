import { FacebookLogo, InstagramLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";
import Logo from "../assets/logoMagus.svg"
import { useDarkMode } from "@/interfaces/DarkMode";

function Footer() {
    const {isDarkMode} = useDarkMode()
    return (
        <>
            <footer className={`  border-t-gray-100 border-t-2 pt-10 mt-16 box-border px-2 ${isDarkMode ? 'bg-gray-900 border-t-2 border-t-gray-800' : 'bg-gray-50'}`}>
                <div className="mx-auto max-w-screen-xl flex flex-col md:flex-row md:justify-between mb-10 gap-10 md:gap-5 ">

                    <div className="flex flex-col items-center md:items-start md:flex-row gap-3 mb-6">
                        <a href="/"><img src={Logo} alt="Exclude logo" className="w-16 md:w-16" /></a>
                        <div className="flex flex-col gap-5 md:gap-1">
                            <p className={`${isDarkMode?'text-gray-100':'text-gray-700'} text-3xl font-bold`}>
                                <a href="/" >
                                    <h3 className="text-center md:text-start mb-3">Magus Notes</h3>
                                </a>
                            </p>
                            <p className="text-center md:text-start">Potenciando tus ideas, una nota a la vez</p>
                        </div>
                    </div>

                        <div className="">
                            <h3 className="text-center text-lg font-semibold md:text-start mb-5">Enlaces Rápidos</h3>
                            <nav className="flex flex-col items-center md:items-start gap-1">
                                
                                <a href="/" className="md:block hover:text-cyan-500 transition-colors">Home</a>
                                <a href="/perfil" className="md:block hover:text-cyan-500 transition-colors">Perfil</a>
                                <a href="/soporte" className="md:block hover:text-cyan-500 transition-colors">Soporte</a>
                                <a href="/nosotros" className="md:block hover:text-cyan-500 transition-colors">Nosotros</a>
                            </nav>
                        </div>
                        <div className="">
                            <h3 className="text-center text-lg font-semibold md:text-start mb-5">Contáctanos</h3>
                            <div className="flex flex-col items-center md:block gap-3">
                                
                            <p><span className="font-semibold">Correo:</span> info@magusnotes.com</p>
                            <p className="my-2"><span className="font-semibold">Teléfono:</span>+52 9984388</p>
                            <p><span className="font-semibold">Dirección:</span> 124 Chiringuito Chatarra, 77500</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-center text-lg font-semibold md:text-start mb-5">Síguenos</h3>
                            <div className="flex gap-3 mt-6 md:mt-0 justify-center">
                                <a href="https://instagram.com" target="_blank">
                                    <InstagramLogo size={26} className="hover:text-cyan-500"/>
                                </a>
                                <a href="https://facebook.com" target="_blank">
                                    <FacebookLogo size={26} className="hover:text-cyan-500"/>
                                </a>
                                <a href="https://linkedin.com" target="_blank">
                                    <LinkedinLogo size={26} className="hover:text-cyan-500" />
                                </a>
                                <a href="https://x.com" target="_blank">
                                    <XLogo size={26} className="hover:text-cyan-500" />
                                </a>
                            </div>
                        </div>
                    
                </div>
                <div className="mx-auto max-w-screen-xl">
                    <hr />
                    <p className="my-10 text-center text-md text-gray-400">© 2024 Magus Notes. Todos los derechos reservados</p>
                </div>
                
            </footer>
        </>
    )
}

export default Footer