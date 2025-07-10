import { useState } from "react";

interface TreeGuideProps {
  tree: {
    name: string;
    guide: { text: string; emoji: string }[];
  };
  onClose?: () => void;
}

export default function TreeGuide({ tree, onClose }: TreeGuideProps) {
  const [step, setStep] = useState(0);
  const total = tree.guide.length;
  const current = tree.guide[step];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md flex flex-col items-center relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <span className="text-5xl mb-4">{current.emoji}</span>
        <h2 className="text-xl font-bold text-green-800 mb-2">{tree.name}</h2>
        <p className="text-green-700 text-center mb-6">{current.text}</p>
        <div className="w-full flex items-center justify-between mb-4">
          <span className="text-green-600 text-sm">Paso {step + 1} de {total}</span>
          <div className="flex-1 mx-2 h-2 bg-green-100 rounded-full overflow-hidden">
            <div
              className="bg-green-400 h-2 rounded-full transition-all"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full shadow mt-2 transition-all disabled:opacity-50"
          onClick={() => setStep(s => s + 1)}
          disabled={step === total - 1}
        >
          {step === total - 1 ? "¡Listo!" : "Siguiente"}
        </button>
      </div>
    </div>
  );
} 