
import React, { useState, useMemo } from 'react';
import type { Project } from '../../types';
import Card from '../ui/Card';
import { ICONS } from '../../constants';

interface InvestmentSimulatorProps {
  projects: Project[];
}

// FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
// FIX: Changed icon type to React.ReactElement<any> to resolve overload error when using React.cloneElement.
const ProjectionCard: React.FC<{ icon: React.ReactElement<any>; label: string; value: string; isHighlighted?: boolean }> = ({ icon, label, value, isHighlighted }) => (
    <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg ring-1 ring-gray-200 dark:ring-gray-700 flex items-center space-x-3 h-full">
        <div className={isHighlighted ? 'text-brand-green' : 'text-gray-500 dark:text-gray-400'}>{React.cloneElement(icon, { className: "h-5 w-5" })}</div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`font-bold text-sm ${isHighlighted ? 'text-brand-green' : 'text-gray-900 dark:text-white'}`}>{value}</p>
        </div>
    </div>
);


const InvestmentSimulator: React.FC<InvestmentSimulatorProps> = ({ projects }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId);
  }, [selectedProjectId, projects]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    setInvestmentAmount(value);
  };
  
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedProjectId(e.target.value);
  }

  const {
      projectedTokens,
      projectedAnnualReturn,
      projectedTotalReturn,
      projectedTotalCO2Avoided,
    } = useMemo(() => {
        if (!selectedProject) {
            return {
                projectedTokens: 0,
                projectedAnnualReturn: 0,
                projectedTotalReturn: 0,
                projectedTotalCO2Avoided: 0,
            };
        }
        
        const tokenPrice = 1; // Assumindo 1 BRL = 1 Token como no ProjectDetail
        const termInYears = parseInt(selectedProject.term, 10) || 0;
        const tokens = investmentAmount / tokenPrice;
        const annualReturn = investmentAmount * (selectedProject.apy / 100);
        const totalReturn = annualReturn * termInYears;
        const investmentShare = selectedProject.fundingGoal > 0 ? investmentAmount / selectedProject.fundingGoal : 0;
        const totalCO2Avoided = selectedProject.co2AvoidedPerYear * termInYears * investmentShare * 1000; // para kg

        return {
            projectedTokens: tokens,
            projectedAnnualReturn: annualReturn,
            projectedTotalReturn: totalReturn,
            projectedTotalCO2Avoided: totalCO2Avoided,
        };
    }, [investmentAmount, selectedProject]);
    
  if (!selectedProject) {
      return null; // Ou um estado de carregamento/erro
  }

  return (
    <Card className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Simulador de Participação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Seção de Entradas */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="project-select" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Selecione o Projeto</label>
                    <select
                        id="project-select"
                        value={selectedProjectId}
                        onChange={handleProjectChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="contribution-amount-input" className="text-sm text-gray-500 dark:text-gray-400">
                           Valor a Aportar (BRL)
                        </label>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-md px-3 py-1 ring-1 ring-transparent focus-within:ring-brand-green transition-all w-48">
                             <span className="text-gray-500 dark:text-gray-400 mr-2 font-semibold">R$</span>
                             <input
                                id="contribution-input-text"
                                type="number"
                                min="0"
                                max="50000"
                                value={investmentAmount}
                                onChange={handleAmountChange}
                                className="bg-transparent border-none focus:ring-0 text-right font-bold text-lg text-gray-900 dark:text-white w-full p-0 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                             />
                        </div>
                    </div>
                    <input
                        id="contribution-amount-input"
                        type="range"
                        min="0"
                        max="50000" // Um máximo razoável para um simulador genérico
                        step="100"
                        value={investmentAmount}
                        onChange={handleAmountChange}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-brand-green"
                    />
                </div>
            </div>

            {/* Seção de Projeções */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                    <ProjectionCard 
                        icon={ICONS.target} 
                        label="Tokens Recebidos" 
                        value={`${projectedTokens.toFixed(2).replace('.',',')}`}
                    />
                     <ProjectionCard 
                        icon={ICONS.money} 
                        label="Ganhos Projetados" 
                        value={projectedTotalReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                        isHighlighted 
                    />
                    <ProjectionCard 
                        icon={ICONS.co2} 
                        label="Impacto CO₂ (Total)" 
                        value={`${projectedTotalCO2Avoided.toFixed(2).replace('.',',')} kg`} 
                        isHighlighted 
                    />
                     <ProjectionCard 
                        icon={ICONS.myPortfolio} 
                        label="Rendimento Anual" 
                        value={projectedAnnualReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    />
                </div>
                <div className="mt-3">
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                        *Projeções baseadas no APY de {selectedProject.apy}% ao longo de {selectedProject.term}. Valores são estimativas e não garantias.
                    </p>
                </div>
            </div>
        </div>
    </Card>
  );
};

export default InvestmentSimulator;
