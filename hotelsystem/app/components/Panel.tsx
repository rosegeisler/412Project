export default function Panel({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex justify-center py-6">
        <div className="
          bg-panel-dark 
          w-full 
          max-w-lg
          p-4 
          space-y-3 
          text-center
          rounded-lg
          inline-block
        ">
          {children}
        </div>
      </div>
    );
  }