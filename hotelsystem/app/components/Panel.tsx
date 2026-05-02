export default function Panel({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex justify-center p-20">
        <div className="
          bg-panel-dark 
          w-full 
          max-w-7xl
          p-4
          space-y-3 
          min-h-[60vh]
          text-center
          flex
          flex-col
          rounded-lg
        ">
          {children}
        </div>
      </div>
    );
  }