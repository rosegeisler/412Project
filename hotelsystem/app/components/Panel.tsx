export default function Panel({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex justify-center p-20">
        <div className="
          bg-panel-dark 
          w-full 
          max-w-5xl
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