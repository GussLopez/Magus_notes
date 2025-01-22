interface NoteTypeSelectorProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
  }
  
  const noteTypes = [
    'Notas Rápidas',
    'Listas de Tareas',
    'Notas Cornell',
    'Notas de Programación',
    'Notas de Aprendizaje',
    'Notas de Proyectos',
    'Notas de Referencia',
    'Notas Visuales'
  ];
  
  const NoteTypeSelector: React.FC<NoteTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
    return (
      <div className="mb-4">
        <label htmlFor="note-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo de Nota
        </label>
        <select
          id="note-type"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full px-3 py-2 border rounded outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border dark:border-cyan-500"
        >
          {noteTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default NoteTypeSelector;