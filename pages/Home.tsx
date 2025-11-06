import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { useMockData } from '../hooks/useMockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Project } from '../types';
import { ICONS } from '../constants';
import Assets from '../components/home/Assets';
import { useTheme } from '../components/theme/ThemeContext';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCountUp } from '../hooks/useCountUp';
import Skeleton from '../components/ui/Skeleton';
import CommunityGoalCard from '../components/home/CommunityGoalCard';
import CommunityGoalCardSkeleton from '../components/home/CommunityGoalCardSkeleton';

const FeaturedProjectCardSkeleton: React.FC = () => (
    <Card className="flex flex-col justify-between">
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded mt-2" />
                </div>
            </div>
        </div>
        <div className="my-4">
            <div className="flex justify-between text-sm mb-1">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-8 rounded" />
            </div>
            <Skeleton className="w-full h-2 rounded-full" />
        </div>
        <div className="flex justify-between items-end">
            <div className="flex space-x-4">
                <div>
                    <Skeleton className="h-3 w-20 rounded mb-1" />
                    <Skeleton className="h-6 w-12 rounded" />
                </div>
                <div>
                    <Skeleton className="h-3 w-24 rounded mb-1" />
                    <Skeleton className="h-6 w-10 rounded" />
                </div>
            </div>
            <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
    </Card>
);

const StatCardSkeleton: React.FC = () => (
    <Card>
        <div className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="ml-4">
                <Skeleton className="h-6 w-24 rounded" />
                <Skeleton className="h-4 w-20 rounded mt-2" />
            </div>
        </div>
    </Card>
);


const FeaturedProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const [ref, isVisible] = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });
    const fundingPercentage = (project.fundingRaised / project.fundingGoal) * 100;

    return (
        <Card ref={ref} className="flex flex-col justify-between hover:shadow-brand-green/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                           {project.type === 'Solar' ? ICONS.solar : ICONS.wind}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{project.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{project.location}</p>
                        </div>
                    </div>
                </div>
                <div className="my-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Arrecadado</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{fundingPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-brand-green h-2 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: isVisible ? `${fundingPercentage}%` : '0%' }}>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-end">
                <div className="flex space-x-4">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Rent. Anual (APY)</p>
                        <p className="text-xl font-bold text-brand-green">{project.apy.toFixed(1)}%</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Taxa de Sucesso</p>
                        <p className="text-xl font-bold text-blue-400">N/D</p>
                    </div>
                </div>
                <button className="shrink-0 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-brand-green text-gray-800 dark:text-white font-semibold py-2 px-3 rounded-lg transition-all hover:text-white hover:scale-105 active:scale-100">
                    Participar
                </button>
            </div>
        </Card>
    );
};

const StatCard: React.FC<{
    // FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    // FIX: Changed icon type to React.ReactElement<any> to resolve overload error when using React.cloneElement.
    icon: React.ReactElement<any>;
    label: string;
    value: number;
    formatter: (num: number) => string;
    color: string;
}> = ({ icon, label, value, formatter, color }) => {
    const [ref, isVisible] = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.5, triggerOnce: true });
    const animatedValue = useCountUp(isVisible ? value : 0, 1500);

    return (
         <Card ref={ref} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:shadow-brand-green/20">
            <div className="flex items-center">
                <div className={`p-3 bg-gray-100 dark:bg-gray-700 rounded-lg ${color}`}>
                    {React.cloneElement(icon, { className: "h-6 w-6" })}
                </div>
                <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatter(animatedValue)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                </div>
            </div>
        </Card>
    );
};


const Dashboard: React.FC = () => {
    const { projects, impactHistory, platformStats, userPortfolio, communityGoal } = useMockData();
    const [isLoading, setIsLoading] = useState(true);
    const featuredProjects = projects.slice(0, 3);
    const { theme } = useTheme();
    const [impactCardRef, isImpactCardVisible] = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.3, triggerOnce: true });
    const animatedImpact = useCountUp(isImpactCardVisible ? userPortfolio.personalCO2Impact : 0, 1500);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#3e3e3e' : '#e5e7eb'}`,
    };
    const axisStrokeColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
    const gridStrokeColor = theme === 'dark' ? '#3e3e3e' : '#e5e7eb';


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                {isLoading ? (
                    <Card className="p-0">
                        <div className="p-6">
                            <Skeleton className="h-6 w-24 rounded" />
                            <Skeleton className="h-4 w-32 rounded mt-2" />
                            <Skeleton className="h-10 w-48 rounded mt-3" />
                            <Skeleton className="h-4 w-40 rounded mt-2" />
                        </div>
                        <Skeleton className="h-60 w-full" />
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700/50">
                             <Skeleton className="h-9 w-full rounded-lg" />
                        </div>
                    </Card>
                ) : (
                    <Assets userPortfolio={userPortfolio} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {isLoading ? (
                       Array.from({ length: 3 }).map((_, i) => <FeaturedProjectCardSkeleton key={i} />)
                   ) : (
                       featuredProjects.map(project => <FeaturedProjectCard key={project.id} project={project} />)
                   )}
                </div>

                <Card ref={impactCardRef}>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Meu Impacto Ambiental</h3>
                    {isLoading ? (
                        <>
                            <Skeleton className="h-10 w-40 rounded" />
                            <Skeleton className="h-4 w-64 rounded mt-2" />
                            <Skeleton className="h-80 w-full mt-4 rounded-lg" />
                        </>
                    ) : (
                        <>
                            <div className="flex items-baseline space-x-2 mb-2">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{animatedImpact.toFixed(1).replace('.',',')} kg</h2>
                                <span className="text-brand-green font-semibold text-lg">de CO₂ evitados</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">Impacto acumulado dos seus investimentos</p>
                            <figure role="group" aria-label="Gráfico do meu impacto ambiental">
                                <div className="h-80 mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={impactHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                                            <XAxis dataKey="name" stroke={axisStrokeColor} />
                                            <YAxis stroke={axisStrokeColor} unit="kg" />
                                            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value.toFixed(1)} kg`} />
                                            <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorImpact)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <figcaption className="sr-only">
                                    Gráfico de área mostrando o impacto acumulado de CO₂ evitado, em quilogramas, de janeiro a julho.
                                    Os dados são: {impactHistory.map(item => `${item.name}: ${item.value}kg`).join('; ')}.
                                </figcaption>
                            </figure>
                        </>
                    )}
                </Card>
            </div>

            <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                {isLoading ? (
                    <CommunityGoalCardSkeleton />
                ) : (
                    <CommunityGoalCard goal={communityGoal} />
                )}

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white px-2 mt-2">Estatísticas da Plataforma</h3>
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard 
                            icon={ICONS.kwh} 
                            label="Energia Gerada" 
                            value={platformStats.totalKWhGenerated / 1000000}
                            formatter={(num) => `${num.toFixed(2).replace('.',',')} GWh`}
                            color="text-yellow-400" 
                        />
                        <StatCard 
                            icon={ICONS.co2} 
                            label="CO₂ Evitado" 
                            value={platformStats.totalCO2Avoided}
                            formatter={(num) => `${Math.round(num).toLocaleString('pt-BR')} ton`}
                            color="text-brand-green" 
                        />
                        <StatCard 
                            icon={ICONS.money} 
                            label="Total Investido" 
                            value={platformStats.totalInvested}
                            formatter={(num) => new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                notation: 'compact',
                                compactDisplay: 'short'
                            }).format(num)}
                            color="text-blue-400" 
                        />
                        <StatCard 
                            icon={ICONS.investors} 
                            label="Investidores Ativos" 
                            value={platformStats.activeInvestors}
                            formatter={(num) => Math.round(num).toString()}
                            color="text-purple-400" 
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;