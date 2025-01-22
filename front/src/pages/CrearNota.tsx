import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { crearNota } from "../services/notas";
import Footer from "../components/Footer";
import { Microphone, Download, Share, FloppyDisk, Trash } from "@phosphor-icons/react";
import NoteTypeSelector from '../components/NoteTypeSelector';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as XLSX from 'xlsx';
import { PDFDownloadLink } from '@react-pdf/renderer';
import NotePDF from '../components/NotePDF';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);

interface Draft {
  id: string;
  titulo: string;
  texto: string;
  frase: string;
  tipo: string;
  ideaPrincipal?: string;
  resumen?: string;
  concepto?: string;
  definicion?: string;
  ejemplo?: string;
  objetivo?: string;
  tareas?: string;
  recursos?: string;
  language?: string;
}
interface CrearNotasProps {
  userId: string | null;
}

const CrearNota: React.FC<CrearNotasProps> = ({ userId }: CrearNotasProps) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [frase, setFrase] = useState('');
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' } | null>(null);
  const [escuchando, setEscuchando] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState('Notas Rápidas');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [noteId, setNoteId] = useState<string | null>(null);

  const [ideaPrincipal, setIdeaPrincipal] = useState('');
  const [resumen, setResumen] = useState('');
  const [concepto, setConcepto] = useState('');
  const [definicion, setDefinicion] = useState('');
  const [ejemplo, setEjemplo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [tareas, setTareas] = useState('');
  const [recursos, setRecursos] = useState('');

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
    }

    const savedDrafts = localStorage.getItem('noteDrafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, [navigate]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !texto.trim()) {
      mostrarMensaje('Por favor, completa al menos el título y el contenido.', 'error');
      return;
    }

    let notaContent = texto;
    if (selectedNoteType === 'Notas Cornell') {
      notaContent = JSON.stringify({ ideaPrincipal, texto, resumen });
    } else if (selectedNoteType === 'Notas de Aprendizaje') {
      notaContent = JSON.stringify({ concepto, definicion, ejemplo });
    } else if (selectedNoteType === 'Notas de Proyectos') {
      notaContent = JSON.stringify({ objetivo, tareas, recursos });
    } else if (selectedNoteType === 'Notas de Programación') {
      notaContent = JSON.stringify({ language: selectedLanguage, code: texto });
    }
    const id_usuario = parseInt(userId);
    try {
      const respuesta = await crearNota({ titulo, texto: notaContent, frase, tipo: selectedNoteType, id_usuario: id_usuario });
      mostrarMensaje('Nota creada con éxito', 'exito');
      setNoteId(respuesta.id);
      setShareLink(respuesta.enlace_compartido);
      setQrCode(respuesta.codigo_qr);
      resetearCampos();
    } catch (error) {
      console.error('Error al crear nota:', error);
      mostrarMensaje('Ocurrió un error al crear la nota.', 'error');
    }
  };

  const resetearCampos = () => {
    setTitulo('');
    setTexto('');
    setFrase('');
    setIdeaPrincipal('');
    setResumen('');
    setConcepto('');
    setDefinicion('');
    setEjemplo('');
    setObjetivo('');
    setTareas('');
    setRecursos('');
  };

  const iniciarReconocimiento = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      mostrarMensaje('El reconocimiento de voz no es compatible con este navegador.', 'error');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setEscuchando(true);
    };

    recognition.onend = () => {
      setEscuchando(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setTexto((prevTexto) => `${prevTexto} ${transcript}`);
    };

    recognition.onerror = (event: any) => {
      console.error('Error en reconocimiento de voz:', event.error);
      mostrarMensaje('Ocurrió un error al usar el reconocimiento de voz.', 'error');
    };

    recognition.start();
  };

  const mostrarMensaje = (texto: string, tipo: 'error' | 'exito') => {
    setMensaje({ texto, tipo });
    setTimeout(() => {
      setMensaje(null);
    }, 5000);
  };

  const handleNoteTypeChange = (type: string) => {
    setSelectedNoteType(type);
  };

  const handleDownload = async (format: string) => {
    let content = texto;
    let fileName = `${titulo}.${format}`;

    switch (format) {
      case 'txt':
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, fileName);
        break;
      case 'docx':
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(content),
                ],
              }),
            ],
          }],
        });
        const buffer = await Packer.toBuffer(doc);
        saveAs(new Blob([buffer]), fileName);
        break;
      case 'xlsx':
        const ws = XLSX.utils.json_to_sheet([{ content }]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Nota");
        XLSX.writeFile(wb, fileName);
        break;
      case 'json':
        const jsonBlob = new Blob([JSON.stringify({ content })], { type: 'application/json' });
        saveAs(jsonBlob, fileName);
        break;
      case 'html':
        const htmlContent = `<html><body>${content}</body></html>`;
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        saveAs(htmlBlob, fileName);
        break;
      case 'md':
        const mdBlob = new Blob([content], { type: 'text/markdown' });
        saveAs(mdBlob, fileName);
        break;
    }
  };

  const handleShare = async () => {
    if (!noteId) {
      mostrarMensaje('Primero guarda la nota antes de compartir', 'error');
      return;
    }
    try {
      const response = await fetch('/api/notas/compartir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: noteId }),
      });
      const data = await response.json();
      if (data.success) {
        setShareLink(data.shareLink);
        setQrCode(data.qrCode);
        mostrarMensaje('Enlace de compartir generado con éxito', 'exito');
      } else {
        mostrarMensaje('Error al generar el enlace de compartir', 'error');
      }
    } catch (error) {
      console.error('Error al compartir la nota:', error);
      mostrarMensaje('Ocurrió un error al compartir la nota.', 'error');
    }
  };

  const renderInputContent = () => {
    switch (selectedNoteType) {
      case 'Notas de Programación':
        return (
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="ruby">Ruby</option>
              <option value="php">PHP</option>
              <option value="swift">Swift</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full h-80 p-2 border rounded font-mono"
              placeholder={`Escribe tu código en ${selectedLanguage} aquí...`}
            ></textarea>
          </div>
        );
      case 'Notas Cornell':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 ">
              <textarea
                placeholder="Notas principales"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full h-[515px] p-2 border rounded"
              ></textarea>
            </div>
            <div className="flex flex-col">
              <textarea
                placeholder="Idea principal"
                value={ideaPrincipal}
                onChange={(e) => setIdeaPrincipal(e.target.value)}
                className="w-full h-[250px] p-2 border rounded mb-4"
              ></textarea>
              <textarea
                placeholder="Resumen"
                value={resumen}
                onChange={(e) => setResumen(e.target.value)}
                className="w-full h-[250px] p-2 border rounded"
              ></textarea>
            </div>
          </div>
        );
      case 'Listas de Tareas':
        return (
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full h-80 p-2 border rounded"
            placeholder="- Tarea 1&#10;- Tarea 2&#10;- Tarea 3"
          ></textarea>
        );
      case 'Notas de Aprendizaje':
        return (
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Concepto"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Definición"
              value={definicion}
              onChange={(e) => setDefinicion(e.target.value)}
              className="w-full h-40 p-2 border rounded"
            ></textarea>
            <textarea
              placeholder="Ejemplo"
              value={ejemplo}
              onChange={(e) => setEjemplo(e.target.value)}
              className="w-full h-40 p-2 border rounded"
            ></textarea>
          </div>
        );
      case 'Notas de Proyectos':
        return (
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Objetivo del proyecto"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Tareas"
              value={tareas}
              onChange={(e) => setTareas(e.target.value)}
              className="w-full h-40 p-2 border rounded"
            ></textarea>
            <textarea
              placeholder="Recursos necesarios"
              value={recursos}
              onChange={(e) => setRecursos(e.target.value)}
              className="w-full h-40 p-2 border rounded"
            ></textarea>
          </div>
        );
      default:
        return (
          <textarea
            id='contenido-nota'
            placeholder="Contenido"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full h-80 min-h-[350px] px-3 py-2 border rounded outline-none relative"
          >

          </textarea>
        );
    }
  };

  const renderPreviewContent = () => {
    switch (selectedNoteType) {
      case 'Notas de Programación':
        return (
          <SyntaxHighlighter language={selectedLanguage} style={docco}>
            {texto}
          </SyntaxHighlighter>
        );
      case 'Notas Cornell':
        return (
          <div className="grid grid-cols-3 gap-4 border p-4 rounded">
            <div className="col-span-2 border-r pr-4">
              <h3 className="font-bold mb-2">Notas principales:</h3>
              <p>{texto}</p>
            </div>
            <div className="overflow-clip">
              <h3 className="font-bold mb-2">Idea principal:</h3>
              <p className="mb-4">{ideaPrincipal}</p>
              <h3 className="font-bold mb-2">Resumen:</h3>
              <p>{resumen}</p>
            </div>
          </div>
        );
      case 'Listas de Tareas':
        return (
          <ul className="list-disc pl-5">
            {texto.split('\n').map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        );
      case 'Notas de Aprendizaje':
        return (
          <div className="border p-4 rounded">
            <h3 className="font-bold text-lg mb-2">{concepto}</h3>
            <p className="mb-4"><strong>Definición:</strong> {definicion}</p>
            <p><strong>Ejemplo:</strong> {ejemplo}</p>
          </div>
        );
      case 'Notas de Proyectos':
        return (
          <div className="border p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Objetivo: {objetivo}</h3>
            <div className="mb-4">
              <h4 className="font-bold">Tareas:</h4>
              <ul className="list-disc pl-5">
                {tareas.split('\n').map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Recursos:</h4>
              <ul className="list-disc pl-5">
                {recursos.split('\n').map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap">{texto}</p>;
    }
  };

  const saveDraft = () => {
    const newDraft: Draft = {
      id: Date.now().toString(),
      titulo,
      texto,
      frase,
      tipo: selectedNoteType,
      ideaPrincipal,
      resumen,
      concepto,
      definicion,
      ejemplo,
      objetivo,
      tareas,
      recursos,
      language: selectedLanguage,
    };
    const updatedDrafts = [...drafts, newDraft];
    setDrafts(updatedDrafts);
    localStorage.setItem('noteDrafts', JSON.stringify(updatedDrafts));
    mostrarMensaje('Borrador guardado con éxito', 'exito');
    resetearCampos();
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem('noteDrafts', JSON.stringify(updatedDrafts));
    mostrarMensaje('Borrador eliminado', 'exito');
  };

  const loadDraft = (draft: Draft) => {
    setTitulo(draft.titulo);
    setTexto(draft.texto);
    setFrase(draft.frase);
    setSelectedNoteType(draft.tipo);
    setIdeaPrincipal(draft.ideaPrincipal || '');
    setResumen(draft.resumen || '');
    setConcepto(draft.concepto || '');
    setDefinicion(draft.definicion || '');
    setEjemplo(draft.ejemplo || '');
    setObjetivo(draft.objetivo || '');
    setTareas(draft.tareas || '');
    setRecursos(draft.recursos || '');
    setSelectedLanguage(draft.language || 'javascript');
    setShowDrafts(false);
  };

  return (
    <>
      <main className="bg-gradient-to-r dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-950 from-cyan-50 to-blue-50 min-h-screen py-8 pb-[200px]">
        <div className='max-w-screen-xl mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-50'>Crear Nueva Nota 🖋️</h1>

          <form onSubmit={manejarSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 relative ">
            <NoteTypeSelector selectedType={selectedNoteType} onTypeChange={handleNoteTypeChange} />

            <input
              id='titulo-nota'
              type="text"
              placeholder="Título de la Nota"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4 outline-none"
            />

            {selectedNoteType !== 'Notas Cornell' && selectedNoteType !== 'Notas de Aprendizaje' && selectedNoteType !== 'Notas de Proyectos' && (
              <input
                id='frase-nota'
                type="text"
                placeholder="Frase"
                value={frase}
                onChange={(e) => setFrase(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-4 outline-none"
              />
            )}

            <div className="flex flex-col md:grid-rows-2 gap-5 mb-4">

              {renderInputContent()}
              {selectedNoteType !== 'Notas Cornell' && selectedNoteType !== 'Notas de Programación' && selectedNoteType !== 'Notas de Aprendizaje' && selectedNoteType !== 'Notas de Proyectos' && (
                <button
                  type="button"
                  onClick={iniciarReconocimiento}
                  className={`absolute top-[520px] left-[35px]  md:top-[520px] md:left-[35px] p-2 rounded text-white font-semibold ${escuchando ? 'bg-red-500' : 'bg-cyan-500 hover:bg-cyan-600 transition-colors'
                    }`}
                >
                  {escuchando ? 'Escuchando...' : <Microphone size={22} weight="bold" />}
                </button>
              )}

              <div className="border rounded p-4 bg-gray-50 dark:bg-gray-700 min-h-[150px]">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Vista previa:</h3>
                {renderPreviewContent()}
              </div>
            </div>
            <div className='md:flex flex-wrap justify-between items-center mt-4'>
              <div className='flex flex-col gap-[15px] md:gap-[0] md:flex-row md:flex-wrap md:space-x-2 mb-2 md:mb-0'>
                <button
                  type="button"
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className='px-3 py-2 bg-gray-500 rounded hover:bg-gray-600 transition-colors text-white font-semibold'
                >
                  <Download size={22} weight="bold" className="inline mr-1" /> Descargar
                </button>
                {showDownloadMenu && (
                  <div className="absolute mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    {['txt', 'docx', 'xlsx', 'json', 'html', 'md'].map((format) => (
                      <button
                        key={format}
                        onClick={() => handleDownload(format)}
                        className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                    <PDFDownloadLink
                      document={<NotePDF title={titulo} content={texto} noteType={selectedNoteType} />}
                      fileName={`${titulo}.pdf`}
                      className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? 'Loading document...' : 'PDF'
                      }
                    </PDFDownloadLink>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className='px-3 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors text-white font-semibold hidden'
                >
                  <Share size={22} weight="bold" className="inline md:mr-1" /> Compartir
                </button>
                <button
                  type="button"
                  onClick={saveDraft}
                  className='px-3 py-2 bg-yellow-500 rounded hover:bg-yellow-600 transition-colors text-white font-semibold'
                >
                  <FloppyDisk size={22} weight="bold" className="inline md:mr-1" /> Guardar como borrador
                </button>
                <button
                  type="button"
                  onClick={() => setShowDrafts(!showDrafts)}
                  className='px-3 py-2 bg-purple-500 rounded hover:bg-purple-600 transition-colors text-white font-semibold'
                >
                  {showDrafts ? 'Ocultar borradores' : 'Mostrar borradores'}
                </button>

                <button
                  type="submit"
                  className='px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-600 transition-colors text-white font-semibold'
                >
                  Guardar Nota
                </button>
              </div>
            </div>
          </form>
          {mensaje && (
            <p
              className={`p-3 mb-5 rounded text-center font-semibold my-10 ${mensaje.tipo === 'exito' ? 'bg-green-600 text-white motion-preset-confetti ' : 'bg-red-600 text-white'
                }`}
            >
              {mensaje.texto}
            </p>
          )}
          {showDrafts && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Borradores</h2>
              {drafts.length === 0 ? (
                <p className="dark:text-gray-300">No hay borradores guardados.</p>
              ) : (
                <ul className="space-y-4">
                  {drafts.map((draft) => (
                    <li key={draft.id} className="p-4 border rounded dark:border-gray-700">
                      <h3 className="font-bold dark:text-white">{draft.titulo}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{draft.tipo}</p>
                      <div className="mt-2">
                        <button
                          onClick={() => loadDraft(draft)}
                          className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Cargar
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash size={18} weight="bold" className="inline mr-1" /> Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {shareLink && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Compartir Nota:</h3>
              <p className="mb-2">Enlace: <a href={shareLink} className="text-blue-500 hover:underline">{shareLink}</a></p>
              <img src={qrCode} alt="QR Code" className="w-32 h-32" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CrearNota;
