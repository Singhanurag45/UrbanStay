const ChartCard = ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
  
      {/* FIXED HEIGHT WRAPPER */}
      <div className="w-full h-[260px]">
        {children}
      </div>
    </div>
  );
  
  export default ChartCard;
  