import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useDarkMode } from '../interfaces/DarkMode'
import { DotsThreeVertical, DownloadSimple, Heart, HeartBreak, QrCode, ShareFat } from '@phosphor-icons/react'
import { useEffect, useState } from 'react';
import Modal from "../components/Modal"
import { jsPDF } from "jspdf";

interface DropDownProps {
    nota: object;
}



export default function DropDown({ nota }: DropDownProps) {
    const { isDarkMode } = useDarkMode()
    const [open, setOpen] = useState(false)
    const [contenidoModal, setContenidoModal] = useState<JSX.Element | null>(null);
    const [isFavorito, setIsFavorito] = useState(false);

    const generarQRCode = async (id: number): Promise<string> => {
        const url = `http://localhost:4000/api/notas/${id}/qrcode`; // Cambia esto a tu URL del backend
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al generar el QR");
        }
        const data = await response.json();
        return data.qrCode;
    };

    const handleImageModal = async () => {
        try {
            const qrcode = await generarQRCode(nota.id);

            setContenidoModal(
                <div className="text-center">
                    <img src={qrcode} alt="QR de Nota" className="mx-auto w-[250px]" />
                </div>
            );
            setOpen(true);
        } catch (error) {
            console.error("Error al mostrar el QR", error);
            setContenidoModal(
                <p className="text-center text-red-500">
                    Ocurrió un error al generar el código QR.
                </p>
            )
        }

        setOpen(true);
    };
    useEffect(() => {
        const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
        const existe = favoritos.some((fav: any) => fav.id === nota.id);
        setIsFavorito(existe);
      }, [nota.id]);

    const toggleFavoritos = () => {
        const favoritosKey = "favoritos";
        const favoritos = JSON.parse(localStorage.getItem(favoritosKey) || "[]");
    
        if (isFavorito) {
          // Si ya está en favoritos, eliminarla
          const nuevosFavoritos = favoritos.filter((fav: any) => fav.id !== nota.id);
          localStorage.setItem(favoritosKey, JSON.stringify(nuevosFavoritos));
          setIsFavorito(false);
        } else {
          // Si no está en favoritos, agregarla
          favoritos.push(nota);
          localStorage.setItem(favoritosKey, JSON.stringify(favoritos));
          setIsFavorito(true);
        }
      };
    
      const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth(); // Ancho de la página
        const margin = 10; // Margen
        const usableWidth = pageWidth - margin * 2; // Ancho utilizable
        const lineHeight = 10; // Altura entre líneas
    
        // Suponiendo que "nota" contiene las propiedades título y contenido
        const { titulo, texto } = nota;
    
        // Configurar título
        doc.setFontSize(40);
        doc.setTextColor('#06b6d4');
        doc.text(titulo || "Sin título", margin, 20);
    
        // Configurar contenido
        doc.setFontSize(14);
        doc.setTextColor("#000000");
        
        // Divide el texto en líneas que se ajusten al ancho de la página
        const lines = doc.splitTextToSize(texto || "Sin contenido", usableWidth);
    
        // Renderiza las líneas en el PDF
        let cursorY = 40; // Posición inicial debajo del título
        lines.forEach(line => {
            if (cursorY > doc.internal.pageSize.getHeight() - margin) {
                // Salto de página si el texto excede el límite vertical
                doc.addPage();
                cursorY = margin;
            }
            doc.text(line, margin, cursorY);
            cursorY += lineHeight; // Ajusta la posición para la siguiente línea
        });
    
        // Descarga el archivo PDF
        doc.save(`${titulo || "nota"}.pdf`);
    };
    

    return (
        <div className="text-right">
            <Menu>
                <MenuButton className={`inline-flex items-center gap-2 rounded-full p-1.5 text-sm/6 font-semibold focus:outline-none    data-[focus]:outline-white ${isDarkMode ? ' data-[open]:bg-gray-900 data-[hover]:bg-gray-900 text-gray-200' : 'hover:bg-gray-50'} transition-colors`}>

                    <DotsThreeVertical size={32} />
                </MenuButton>
                <MenuItems
                    transition
                    anchor="bottom end"
                    className={`w-52 origin-top-right rounded-md mt-2 p-1 text-sm/6  transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white border '}`}
                >
                    <MenuItem>
                        <button 
                        onClick={toggleFavoritos}
                        className={`group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-cyan-500 hover:text-white  ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            {isFavorito ? <HeartBreak size={20} weight="fill" className='text-red-500 motion-preset-pop motion-duration-100'/> : <Heart size={20} weight="fill" />}
                            {isFavorito ? "Eliminar de Favoritos"  : "Añadir a Favoritos"}
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button className={`group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-cyan-500 hover:text-white  ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            <ShareFat size={20} weight="fill" />

                            Compartir
                        </button>
                    </MenuItem>
                    <div className={`my-1 h-px bg-white`} />
                    <MenuItem>
                        <button 
                        onClick={handleDownloadPDF}
                        className={`group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-cyan-500 hover:text-white  ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>

                            <DownloadSimple size={20} weight="regular" />
                            Descargar
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button
                            onClick={handleImageModal}
                            className={`group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-cyan-500 hover:text-white  ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                        >
                            <QrCode size={20} weight='light' />
                            QR

                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
            <Modal open={open} onClose={() => setOpen(false)}>
                {contenidoModal}
            </Modal>
        </div>
    )
}