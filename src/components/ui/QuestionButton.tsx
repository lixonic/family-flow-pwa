interface QuestionButtonProps {
  onNavigate: (screen: string) => void;
}

export function QuestionButton({ onNavigate }: QuestionButtonProps) {
  return (
    <button
      onClick={() => onNavigate('faq')}
      className="fixed bottom-32 right-6 lg:bottom-auto lg:top-6 z-10 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors"
      title="View frequently asked questions"
    >
      <span className="text-sm font-medium">Questions?</span>
    </button>
  );
}