

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import type { UserPortfolio } from '../../types';
import { useTheme } from '../theme/ThemeContext';
import { useCountUp } from '../../hooks/useCountUp';

interface AssetsProps {
    userPortfolio: UserPortfolio;
}

// Função para gerar dados de gráfico plausíveis com base na volatilidade
const generateChartData = (start: number, end: number, points: number, volatility: number) => {
    const data = [];
    const increment = (end - start) / (points - 1);
    for (let i = 0; i < points; i++) {
        const baseValue = start + i * increment;
        const randomFactor = (Math.random() - 0.5) * (end * volatility);
        let value;

        if (i === 0) {
            value = start; // Garante que o primeiro ponto seja o valor inicial
        } else if (i === points - 1) {
            value = end; // Garante que o último ponto seja o valor final
        } else {
            value = baseValue + randomFactor;
        }

        data.push({
            name: `point${i + 1}`,
            value: Math.max(0, parseFloat(value.toFixed(2))) // Garante que o valor não seja negativo
        });
    }
    return data;
};


const CustomTooltip = ({ active, payload, chartData, theme }: any) => {
  if (active && payload && payload.length) {
    const currentPoint = payload[0].payload;
    const currentValue = payload[0].value;
    const currentIndex = chartData.findIndex((item: any) => item.name === currentPoint.name);
    
    let trendIcon = null;
    let trendColor = 'text-gray-900 dark:text-white';

    if (currentIndex > 0) {
      const previousPoint = chartData[currentIndex - 1];
      if (currentValue > previousPoint.value) {
        trendIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
          </svg>
        );
        trendColor = 'text-brand-green';
      } else if (currentValue < previousPoint.value) {
        trendIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        );
        trendColor = 'text-brand-red';
      }
    }

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg">
         <div className={`flex items-center space-x-1 ${trendColor}`}>
          {trendIcon}
          <p className="text-sm font-semibold">
            {currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Assets: React.FC<AssetsProps> = ({ userPortfolio }) => {
    const [activeRange, setActiveRange] = useState('1D');
    const timeRanges = ['1D', '7D', '1M', '3M', '1A'];
    const { theme } = useTheme();

    const totalBalance = userPortfolio.totalInvested + userPortfolio.totalEarnings;

    const periodData = useMemo(() => {
        let points = 30;
        let volatility = 0.01; // 1%
        let changeMultiplier = 0.008; // Mudança base para 1D

        switch (activeRange) {
            case '7D':
                points = 40;
                volatility = 0.03;
                changeMultiplier = 0.035;
                break;
            case '1M':
                points = 50;
                volatility = 0.08;
                changeMultiplier = 0.07;
                break;
            case '3M':
                points = 60;
                volatility = 0.12;
                changeMultiplier = 0.15;
                break;
            case '1A':
                points = 70;
                volatility = 0.20;
                changeMultiplier = 0.25;
                break;
            case '1D':
            default:
                // Valores padrão para 1D
                break;
        }
        
        // Gerador de número pseudo-aleatório para consistência ao trocar de período
        const seed = activeRange.length;
        const seededRandom = (Math.sin(seed) + 1) / 2;
        const direction = seededRandom > 0.4 ? 1 : -1; // Mais chance de ser positivo

        const changeValue = totalBalance * changeMultiplier * direction * (seededRandom + 0.5);
        const previousBalance = totalBalance - changeValue;
        
        const chartData = generateChartData(previousBalance, totalBalance, points, volatility);
        const percentageChange = previousBalance !== 0 ? (changeValue / previousBalance) * 100 : 0;

        return {
            changeValue,
            percentageChange,
            chartData
        };

    }, [activeRange, totalBalance]);
    
    const animatedBalance = useCountUp(totalBalance, 1200);
    const animatedChangeValue = useCountUp(periodData.changeValue, 1200);
    const animatedPercentageChange = useCountUp(periodData.percentageChange, 1200);
    const isPositiveChange = periodData.changeValue >= 0;

    return (
        <Card className="text-gray-900 dark:text-white relative overflow-hidden p-0">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">Ativos</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Seu saldo total</p>
                <div className="flex items-center space-x-3 my-1">
                    <p className="text-4xl font-bold">{animatedBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <div className={`flex items-center ${isPositiveChange ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-red/20 text-brand-red'} text-sm font-semibold px-3 py-1 rounded-full`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           {isPositiveChange ? 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> :
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />}
                        </svg>
                        {animatedPercentageChange.toFixed(2).replace('.',',')}%
                    </div>
                </div>
                <p className={`text-sm ${isPositiveChange ? 'text-brand-green' : 'text-brand-red'}`}>{`${isPositiveChange ? '+' : ''}${animatedChangeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${activeRange})`}</p>
            </div>

            <div className="h-60 -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={periodData.chartData}
                        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="5 5" stroke={theme === 'dark' ? '#3e3e3e' : '#e5e7eb'} vertical={false} />
                        <XAxis dataKey="name" hide={true} />
                        <YAxis hide={true} domain={['dataMin - (dataMax * 0.05)', 'dataMax + (dataMax * 0.05)']} />
                        <Tooltip
                            content={<CustomTooltip chartData={periodData.chartData} theme={theme} />}
                            cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '3 3' }}
                            position={{ y: 20 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#22c55e"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAssets)"
                            activeDot={{
                                r: 8,
                                stroke: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                                strokeWidth: 4,
                                fill: '#22c55e'
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex justify-around items-center px-6 pb-4 border-t border-gray-200 dark:border-gray-700/50 pt-4">
                 {timeRanges.map(range => (
                    <button 
                        key={range}
                        onClick={() => setActiveRange(range)}
                        className={`text-sm font-semibold px-3 py-1.5 rounded-md transition-colors duration-200 w-12 ${
                            activeRange === range 
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {range}
                    </button>
                 ))}
            </div>
        </Card>
    );
};

export default Assets;