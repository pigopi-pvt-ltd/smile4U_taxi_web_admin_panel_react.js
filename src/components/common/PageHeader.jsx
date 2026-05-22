import React from 'react';
import { HiArrowPath } from 'react-icons/hi2';

const PageHeader = ({ 
  title, 
  count, 
  onRefresh, 
  refreshing = false,
  showRefresh = true,
  extraButtons 
}) => {
  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0A1128]/80 py-2.5 md:py-2 px-4 md:px-6 flex flex-row items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 min-h-[56px] sticky top-16 z-30 backdrop-blur-md transition-colors">
      <div className="min-w-0">
        <h2 className="text-[13px] md:text-xl font-extrabold text-primary-yellow uppercase tracking-tighter md:tracking-tight truncate">
          {title}
          {count !== undefined && (
            <span className="text-black dark:text-white font-normal font-bold pl-1 pr-1 hidden sm:inline">
              ({count})
            </span>
          )}
        </h2>
      </div>
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
        {extraButtons}
        {showRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="hidden md:flex items-center gap-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-[10px] md:text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <HiArrowPath className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;