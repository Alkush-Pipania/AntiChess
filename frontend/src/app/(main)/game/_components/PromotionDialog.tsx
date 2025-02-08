interface PromotionDialogProps {
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onClose: () => void;
}

export default function PromotionDialog({ onSelect, onClose }: PromotionDialogProps) {
  const pieces = [
    { type: 'q', label: 'Queen' },
    { type: 'r', label: 'Rook' },
    { type: 'b', label: 'Bishop' },
    { type: 'n', label: 'Knight' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-black text-lg font-bold mb-4">Choose promotion piece</h2>
        <div className="grid grid-cols-2 gap-2">
          {pieces.map(({ type, label }) => (
            <button
              key={type}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => onSelect(type)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}