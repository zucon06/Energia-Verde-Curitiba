import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { useMockData } from '../hooks/useMockData';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ICONS } from '../constants';
import type { PortfolioInvestment, Achievement } from '../types';
import TransactionHistoryTable from '../components/portfolio/TransactionHistoryTable';
import ImpactSimulator from '../components/portfolio/ImpactSimulator';
import { useTheme } from '../components/theme/ThemeContext';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCountUp } from '../hooks/useCountUp';
import ESGScoreCard from '../components/portfolio/ESGScoreCard';
import Tooltip from '../components/ui/Tooltip';
import Achievements from '../components/portfolio/Achievements';
import Skeleton from '../components/ui/Skeleton';

const PortfolioSummaryCardSkeleton: React.FC = () => (
    <Card className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div>
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-6 w-24 rounded mt-2" />
        </div>
    </Card>
);

// FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
// FIX: Changed icon type to React.ReactElement<any> to resolve type inference issues with SVG elements.
const PortfolioSummaryCard: React.FC<{ title: string | React.ReactNode, value: number, formatter: (num: number) => string, icon: React.ReactElement<any> }> = ({ title, value, formatter, icon }) => {
    const [ref, isVisible] = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.5, triggerOnce: true });
    const animatedValue = useCountUp(isVisible ? value : 0, 1500);

    return (
        <Card ref={ref} className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 text-brand-green rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatter(animatedValue)}</p>
            </div>
        </Card>
    );
};

const PROJECT_COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f97316', '#ec4899'];

const CustomBarTooltip = ({ active, payload, theme }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded-lg shadow-lg">
                <p className="font-bold text-sm mb-1">{data.projectName}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Investido: <span className="font-semibold text-gray-900 dark:text-white">{data.amountInvested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                <p className="text-xs text-brand-green">Rendimentos: <span className="font-semibold">{data.currentEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
            </div>
        );
    }
    return null;
};

const MeuPortfolio: React.FC = () => {
  const { userPortfolio, impactHistory, projects, platformStats } = useMockData();
  const [isLoading, setIsLoading] = useState(true);
  const [isInvestmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<PortfolioInvestment | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const financialFlowByMonth = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    
    const monthlyData = months.reduce((acc, month) => {
        acc[month] = { investment: 0, earnings: 0 };
        return acc;
    }, {} as { [key: string]: { investment: number, earnings: number } });
    
    const monthMap: { [key: string]: number } = { 'Jan': 1, 'Fev': 2, 'Mar': 3, 'Abr': 4, 'Mai': 5, 'Jun': 6, 'Jul': 7 };

    userPortfolio.transactions.forEach(tx => {
        const txDate = new Date(tx.date);
        const txMonthNumber = txDate.getUTCMonth() + 1;
        
        for (const monthName in monthMap) {
            if (monthMap[monthName] === txMonthNumber) {
                if (tx.type === 'Investimento') {
                    monthlyData[monthName].investment += tx.amount;
                } else if (tx.type === 'Rendimento') {
                    monthlyData[monthName].earnings += tx.amount;
                }
                break;
            }
        }
    });

    return months.map(month => ({
        month: month,
        Investimentos: monthlyData[month].investment,
        Rendimentos: monthlyData[month].earnings,
    }));
  }, [userPortfolio.transactions]);

  const combinedImpactAndEarningsData = useMemo(() => {
    let cumulativeEarnings = 0;
    const cumulativeEarningsHistory = financialFlowByMonth.map(item => {
        cumulativeEarnings += item.Rendimentos;
        return {
            month: item.month,
            earnings: cumulativeEarnings
        };
    });

    return impactHistory.map((impactItem) => {
      const earningsItem = cumulativeEarningsHistory.find(e => e.month === impactItem.name);
      return {
        name: impactItem.name,
        co2: impactItem.value,
        earnings: earningsItem ? earningsItem.earnings : 0,
      };
    });
  }, [financialFlowByMonth, impactHistory]);
  
  const investmentBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {
        Solar: 0,
        Eólica: 0,
    };

    userPortfolio.investments.forEach(investment => {
        const project = projects.find(p => p.id === investment.projectId);
        if (project) {
            breakdown[project.type] += investment.amountInvested;
        }
    });

    return Object.entries(breakdown)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0);
  }, [userPortfolio.investments, projects]);

  const COLORS = ['#facc15', '#22d3ee']; // ~yellow-400 for Solar, ~cyan-400 for Eólica

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius = 0, outerRadius = 0, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent === 0) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-2 rounded-lg shadow-lg">
          <p className="font-semibold text-sm">{`${data.name}: ${data.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</p>
        </div>
      );
    }
    return null;
  };

  const handleInvestmentClick = (investment: PortfolioInvestment) => {
    setSelectedInvestment(investment);
    setInvestmentModalOpen(true);
  };

  const handleCloseInvestmentModal = () => {
    setInvestmentModalOpen(false);
    setSelectedInvestment(null);
  };
  
  const handleAchievementClick = (achievement: Achievement) => {
      setSelectedAchievement(achievement);
  };

  const handleCloseAchievementModal = () => {
      setSelectedAchievement(null);
  };

  const handleGoToProject = () => {
    if (selectedInvestment) {
      navigate('/projetos', { state: { openProject: selectedInvestment.projectId } });
      handleCloseInvestmentModal();
    }
  };

  const axisStrokeColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridStrokeColor = theme === 'dark' ? '#3e3e3e' : '#e5e7eb';
  const tooltipStyle = {
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      border: `1px solid ${theme === 'dark' ? '#3e3e3e' : '#e5e7eb'}`,
  };
  const tooltipCursorFill = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
  };

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meu Portfólio Verde</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <PortfolioSummaryCardSkeleton key={i} />)
            ) : (
                <>
                    <PortfolioSummaryCard title="Valor Total Aportado" value={userPortfolio.totalInvested} formatter={(num) => num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={ICONS.money}/>
                    <PortfolioSummaryCard title="Rendimentos Totais" value={userPortfolio.totalEarnings} formatter={(num) => num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={ICONS.myPortfolio}/>
                    <PortfolioSummaryCard 
                      title={
                        <div className="flex items-center gap-1">
                          Poder de Voto (DAO)
                          <Tooltip text="Seu poder de voto é igual ao valor total investido. Use-o para participar das decisões da comunidade.">
                              <span tabIndex={0} className="cursor-help">{React.cloneElement(ICONS.info as React.ReactElement<any>, { className: "h-3.5 w-3.5" })}</span>
                          </Tooltip>
                        </div>
                      } 
                      value={userPortfolio.votingPower} 
                      formatter={(num) => `${Math.round(num).toLocaleString('pt-BR')} VP`} 
                      icon={ICONS.dao}
                    />
                    <PortfolioSummaryCard title="Impacto Pessoal" value={userPortfolio.personalCO2Impact} formatter={(num) => `${num.toFixed(1).replace('.',',')} kg CO₂`} icon={ICONS.co2}/>
                </>
            )}
        </div>

        <ESGScoreCard 
            co2Impact={userPortfolio.personalCO2Impact} 
            kwhGenerated={userPortfolio.personalKWhGenerated}
            socialImpactScore={userPortfolio.socialImpactScore}
            governanceActivityScore={userPortfolio.governanceActivityScore}
            averageESGScore={platformStats.averageESGScore}
        />
        
        <Achievements userPortfolio={userPortfolio} onAchievementClick={handleAchievementClick} projects={projects} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Histórico de Rendimentos Mensais</h3>
                {isLoading ? <Skeleton className="h-80 w-full" /> : (
                <figure role="group" aria-label="Gráfico do histórico de rendimentos mensais">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userPortfolio.earningsHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEarningsHistory" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                                <XAxis dataKey="month" stroke={axisStrokeColor} fontSize={12} />
                                <YAxis 
                                    stroke={axisStrokeColor} 
                                    fontSize={12}
                                    tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', compactDisplay: 'short' }).format(value as number)} 
                                />
                                <RechartsTooltip
                                    contentStyle={tooltipStyle}
                                    formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Rendimentos']}
                                    cursor={{ fill: tooltipCursorFill }}
                                />
                                <Area type="monotone" dataKey="value" name="Rendimentos" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorEarningsHistory)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <figcaption className="sr-only">
                        Gráfico de área mostrando os rendimentos mensais de {userPortfolio.earningsHistory[0]?.month} a {userPortfolio.earningsHistory[userPortfolio.earningsHistory.length - 1]?.month}.
                        Valores: {userPortfolio.earningsHistory.map(item => `${item.month}: ${item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`).join('; ')}.
                    </figcaption>
                </figure>
                )}
            </Card>

            <Card className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Fluxo Financeiro Mensal</h3>
                 {isLoading ? <Skeleton className="h-80 w-full" /> : (
                 <figure role="group" aria-label="Gráfico de fluxo financeiro mensal">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financialFlowByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                                <XAxis dataKey="month" stroke={axisStrokeColor} fontSize={12} />
                                <YAxis 
                                    stroke={axisStrokeColor} 
                                    fontSize={12}
                                    tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} 
                                />
                                <RechartsTooltip 
                                    contentStyle={tooltipStyle} 
                                    formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    cursor={{ fill: tooltipCursorFill }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Investimentos" fill="url(#colorInvestment)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Rendimentos" fill="url(#colorEarnings)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     <figcaption className="sr-only">
                        Gráfico de barras mostrando investimentos e rendimentos por mês.
                        {financialFlowByMonth.map(item => `${item.month}: ${item.Investimentos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em investimentos, ${item.Rendimentos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em rendimentos`).join('; ')}.
                    </figcaption>
                </figure>
                )}
            </Card>

            <Card className="lg:col-span-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Meus Investimentos</h3>
                 {isLoading ? <Skeleton className="h-80 w-full mt-4" /> : (
                 <figure role="group" aria-label="Gráfico e lista de meus investimentos">
                    <div className="h-80 w-full mt-4 -ml-4" aria-hidden="true">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={userPortfolio.investments}
                                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="projectName"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(name) => name.length > 18 ? `${name.substring(0, 18)}...` : name}
                                    tick={{ fill: theme === 'dark' ? '#e5e7eb' : '#374151', fontSize: 12 }}
                                    width={140}
                                    interval={0}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: tooltipCursorFill }}
                                    content={<CustomBarTooltip theme={theme} />}
                                />
                                <Bar dataKey="amountInvested" name="Valor Investido" radius={[0, 4, 4, 0]} barSize={20}>
                                    {
                                        userPortfolio.investments.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PROJECT_COLORS[index % PROJECT_COLORS.length]} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <figcaption className="sr-only">
                        Gráfico de barras dos investimentos. {userPortfolio.investments.map(inv => `${inv.projectName}: ${inv.amountInvested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`).join('; ')}. Uma lista interativa com os mesmos dados está disponível abaixo.
                    </figcaption>
                 </figure>
                 )}
                 <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-2 flex-grow">
                    <ul aria-label="Lista detalhada de investimentos">
                        {userPortfolio.investments.map((investment, index) => (
                            <li key={investment.projectId}>
                                <button
                                    onClick={() => handleInvestmentClick(investment)}
                                    className="flex items-center justify-between w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green"
                                >
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-3 shrink-0" style={{ backgroundColor: PROJECT_COLORS[index % PROJECT_COLORS.length] }}></span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{investment.projectName}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap pl-2">
                                        {investment.amountInvested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>

            <Card className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Meu Impacto e Retorno Acumulados</h3>
                {isLoading ? <Skeleton className="h-80 w-full" /> : (
                <figure role="group" aria-label="Gráfico de impacto e retorno acumulados">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={combinedImpactAndEarningsData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorImpactPortfolio" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorEarningsPortfolio" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                                <XAxis dataKey="name" stroke={axisStrokeColor} />
                                <YAxis yAxisId="left" stroke="#22c55e" unit="kg" />
                                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" unit="R$" />
                                <RechartsTooltip 
                                    contentStyle={tooltipStyle} 
                                    formatter={(value: number, name: string) => {
                                        if (name === 'CO₂ Evitado') {
                                            return `${value.toFixed(1)} kg`;
                                        }
                                        if (name === 'Rendimentos') {
                                            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                        }
                                        return value;
                                    }}
                                    labelStyle={{ color: theme === 'dark' ? '#e5e7eb' : '#111827' }}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Area 
                                    yAxisId="left"
                                    type="monotone" 
                                    dataKey="co2" 
                                    name="CO₂ Evitado"
                                    stroke="#22c55e" 
                                    fillOpacity={1} 
                                    fill="url(#colorImpactPortfolio)" 
                                />
                                 <Area 
                                    yAxisId="right"
                                    type="monotone" 
                                    dataKey="earnings" 
                                    name="Rendimentos"
                                    stroke="#3b82f6" 
                                    fillOpacity={1} 
                                    fill="url(#colorEarningsPortfolio)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                     <figcaption className="sr-only">
                        Gráfico de área dupla mostrando o CO₂ evitado em quilogramas e os rendimentos acumulados em BRL, de {combinedImpactAndEarningsData[0]?.name} a {combinedImpactAndEarningsData[combinedImpactAndEarningsData.length - 1]?.name}.
                        Dados: {combinedImpactAndEarningsData.map(d => `${d.name}: ${d.co2.toFixed(1)}kg de CO₂, ${d.earnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`).join('; ')}.
                    </figcaption>
                </figure>
                )}
            </Card>

            <Card className="lg:col-span-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Distribuição por Tipo de Projeto</h3>
                {isLoading ? <Skeleton className="h-80 w-full" /> : (
                <figure role="group" aria-label="Gráfico de distribuição por tipo de projeto">
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={investmentBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius="90%"
                                    fill="#8884d8"
                                    dataKey="value"
                                    stroke={theme === 'dark' ? "#1e1e1e" : "#ffffff"}
                                    strokeWidth={2}
                                >
                                    {investmentBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomPieTooltip />} />
                                <Legend iconSize={10} wrapperStyle={{paddingTop: '10px'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <figcaption className="sr-only">
                        Gráfico de pizza mostrando a distribuição de investimentos por tipo de projeto.
                        {investmentBreakdown.map(item => `${item.name}: ${item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`).join('; ')}.
                    </figcaption>
                </figure>
                )}
            </Card>

            <ImpactSimulator projects={projects} />
            
            <Card className="lg:col-span-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Histórico de Transações</h3>
                <TransactionHistoryTable transactions={userPortfolio.transactions} projects={projects} />
            </Card>

        </div>
        
        {selectedInvestment && (() => {
            const projectDetails = projects.find(p => p.id === selectedInvestment.projectId);
            return (
                <Modal
                    isOpen={isInvestmentModalOpen}
                    onClose={handleCloseInvestmentModal}
                    title={`Detalhes de ${selectedInvestment.projectName}`}
                >
                    <div className="space-y-6">
                        <img 
                            src={projectDetails?.image || selectedInvestment.projectImage}
                            alt={selectedInvestment.projectName} 
                            className="w-full h-40 object-cover rounded-lg"
                        />
                        
                        <Card className="bg-gradient-to-br from-brand-green/20 to-gray-50 dark:to-gray-800 text-center p-4 ring-1 ring-brand-green/30">
                            <p className="text-sm font-medium text-green-500 dark:text-green-300">Rendimentos Atuais</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{selectedInvestment.currentEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </Card>

                        <div className="space-y-4 text-sm pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                                    {React.cloneElement(ICONS.security, { className: 'h-5 w-5' })}
                                    <span>Status do Projeto</span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedInvestment.status === 'Ativo' ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-600 text-gray-300'}`}>
                                    {selectedInvestment.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                                    {React.cloneElement(ICONS.money, { className: 'h-5 w-5' })}
                                    <span>Valor Investido</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {selectedInvestment.amountInvested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                                    {React.cloneElement(ICONS.target, { className: 'h-5 w-5' })}
                                    <span>Tokens Possuídos</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {selectedInvestment.tokensOwned.toLocaleString('pt-BR')}
                                </span>
                            </div>
                        </div>

                        {projectDetails && projectDetails.updates && projectDetails.updates.length > 0 && (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                   {React.cloneElement(ICONS.calendar, { className: 'h-5 w-5 text-gray-500 dark:text-gray-400' })}
                                   <span>Atualizações do Projeto</span>
                                </h4>
                                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                                    {projectDetails.updates.map((update) => (
                                        <div key={update.id} className="mb-8 last:mb-0 ml-4">
                                            <span className="absolute -left-[9px] top-1 flex items-center justify-center w-4 h-4 bg-brand-green rounded-full ring-4 ring-white dark:ring-gray-800"></span>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{formatDate(update.date)}</p>
                                                <h5 className="text-md font-bold text-gray-900 dark:text-white mt-1">{update.title}</h5>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{update.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleGoToProject}
                            className="w-full mt-2 bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Ver Página do Projeto
                        </button>
                    </div>
                </Modal>
            )
        })()}

        <Modal
            isOpen={selectedAchievement !== null}
            onClose={handleCloseAchievementModal}
            title="Detalhes da Conquista"
        >
            {selectedAchievement && (() => {
                const metricValue = selectedAchievement.getMetricValue?.(userPortfolio) ?? userPortfolio[selectedAchievement.metric as keyof typeof userPortfolio] as number;
                
                let currentLevelIndex = -1;
                for (let i = selectedAchievement.levels.length - 1; i >= 0; i--) {
                    if (metricValue >= selectedAchievement.levels[i].threshold) {
                        currentLevelIndex = i;
                        break;
                    }
                }
                const nextLevel = selectedAchievement.levels[currentLevelIndex + 1];

                return (
                    <div className="p-2 space-y-6">
                        <div className="text-center">
                           <div className="flex items-center justify-center h-20 w-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                                {React.cloneElement(selectedAchievement.icon, { className: 'h-10 w-10 text-brand-green' })}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedAchievement.title}</h3>
                            {currentLevelIndex > -1 && (
                                <p className="font-semibold text-gray-500 dark:text-gray-400">Nível Atual: {selectedAchievement.levels[currentLevelIndex].name}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            {selectedAchievement.levels.map((level, index) => {
                                const isUnlocked = currentLevelIndex >= index;
                                const isNext = currentLevelIndex + 1 === index;
                                
                                let progress = 0;
                                if (isNext) {
                                    const prevThreshold = selectedAchievement.levels[currentLevelIndex]?.threshold || 0;
                                    progress = ((metricValue - prevThreshold) / (level.threshold - prevThreshold)) * 100;
                                }

                                // FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
                                // FIX: Changed type to React.ReactElement<any> to resolve overload error.
                                const levelIcons: Record<string, React.ReactElement<any>> = {
                                    Bronze: ICONS.trophyBronze,
                                    Prata: ICONS.trophySilver,
                                    Ouro: ICONS.trophyGold,
                                    Platina: ICONS.trophyGold,
                                };

                                return (
                                    <div key={level.name} className={`p-4 rounded-lg transition-all ${isUnlocked ? 'bg-green-50 dark:bg-green-900/40 ring-1 ring-green-200 dark:ring-green-500/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className={isUnlocked ? 'opacity-100' : 'opacity-40'}>{levelIcons[level.name]}</span>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{level.name}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Meta: {level.threshold.toLocaleString('pt-BR')} {selectedAchievement.unit}
                                                    </p>
                                                </div>
                                            </div>
                                            {isUnlocked && (
                                                <div className="p-1.5 bg-brand-green rounded-full text-white">
                                                    {React.cloneElement(ICONS.check as React.ReactElement<any>, { className: 'w-4 h-4' })}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50 space-y-2">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{level.detailedDescription}</p>
                                            {currentLevelIndex === index && nextLevel && (
                                                 <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                    <span className="font-bold">Próximo Passo:</span> {level.nextStep}
                                                 </p>
                                            )}
                                        </div>
                                        {isNext && (
                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-500 dark:text-gray-400">Progresso para o próximo nível</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{progress.toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div className="bg-brand-green h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}
        </Modal>
    </div>
  );
};

export default MeuPortfolio;