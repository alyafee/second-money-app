import React, { useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailySpending, CategorySpending } from '../types';

interface AnalyticsChartProps {
  weeklyData: DailySpending[];
  monthlyData: CategorySpending[];
}

type ViewMode = 'weekly' | 'monthly';

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ weeklyData, monthlyData }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');

  const totalSpending = viewMode === 'weekly' 
    ? weeklyData.reduce((acc, curr) => acc + curr.amount, 0)
    : monthlyData.reduce((acc, curr) => acc + curr.amount, 0);

  const avgSpending = viewMode === 'weekly'
    ? Math.round(totalSpending / 7)
    : Math.round(totalSpending / 30); // Approximation for monthly daily avg

  // Prepare data based on view mode
  const currentData = viewMode === 'weekly' ? weeklyData : monthlyData;
  const xAxisKey = viewMode === 'weekly' ? 'day' : 'name';
  const labelText = viewMode === 'weekly' ? 'معدل الإنفاق اليومي' : 'إجمالي إنفاق الشهر';
  const mainValue = viewMode === 'weekly' ? avgSpending : totalSpending;

  return (
    <section className="px-4 py-4">
      <h3 className="text-lg font-bold text-white mb-3">
        {viewMode === 'weekly' ? 'التحليل الأسبوعي' : 'تفاصيل المصروفات الشهرية'}
      </h3>
      <div className="rounded-xl border border-surface-border bg-surface-dark p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-text-secondary font-medium">{labelText}</p>
            <p className="text-lg font-bold text-white">{mainValue.toLocaleString()} ر.س</p>
          </div>
          <div className="relative">
            <select 
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="bg-black/20 text-text-secondary text-xs font-medium rounded-lg border-none py-1.5 pr-8 pl-3 focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer hover:bg-black/30 transition-colors"
            >
              <option value="weekly">أسبوعي</option>
              <option value="monthly">شهري</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-secondary text-sm">expand_more</span>
            </div>
          </div>
        </div>

        <div className="h-40 w-full">
          {currentData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData}>
                <XAxis 
                  dataKey={xAxisKey} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#92c9a4', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                  interval={0}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#102216', border: '1px solid #326744', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#13ec5b' }}
                  formatter={(value: number) => [`${value} ر.س`, '']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {currentData.map((entry, index) => {
                    const fill = viewMode === 'weekly' 
                      ? ((entry as DailySpending).active ? '#13ec5b' : 'rgba(19, 236, 91, 0.3)')
                      : (entry as CategorySpending).color;
                      
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={fill}
                        className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-text-secondary text-xs">
              لا توجد بيانات لهذا الشهر
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsChart;