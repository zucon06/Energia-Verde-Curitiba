
import React, { useState, useMemo } from 'react';
import type { Project } from '../../types';
import Card from '../ui/Card';
import { ICONS } from '../../constants';

interface ImpactSimulatorProps {
  projects: Project[];
}

// FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
// FIX: Changed icon type to React.ReactElement<any> to resolve overload error when using React.cloneElement.
const ResultCard: React.FC<{ icon: React.ReactElement<any>; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-center flex-1">
        <div className="flex justify-center text-brand-green">{React.cloneElement(icon, { className: "h-8 w-8" })}</div>
        <p className="mt-2 font-bold text-xl text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
);

const ImpactSimulator: React.FC<ImpactSimulatorProps> = ({ projects }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [investmentAmount, setInvestmentAmount] = useState<number>(5000);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId);
  }, [selectedProjectId, projects]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setInvestmentAmount(value);
  };
  
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedProjectId(e.target.value);
  }

  const {
      projectedTotalCO2Avoided,
      projectedTotalKWhGenerated,
    } = useMemo(() => {
        if (!selectedProject) {
            return {
                projectedTotalCO2Avoided: 0,
                projectedTotalKWhGenerated: 0,
            };
        }
        
        const termInYears = parseInt(selectedProject.term, 10) || 0;
        const investmentShare = selectedProject.fundingGoal > 0 ? investmentAmount / selectedProject.fundingGoal : 0;
        
        const totalCO2AvoidedInTons = selectedProject.co2AvoidedPerYear * termInYears * investmentShare;
        const totalKWhGenerated = selectedProject.kwhGeneratedPerYear * termInYears * investmentShare;

        return {
            projectedTotalCO2Avoided: totalCO2AvoidedInTons * 1000, // to kg
            projectedTotalKWhGenerated: totalKWhGenerated,
        };
    }, [investmentAmount, selectedProject]);
    
  if (!selectedProject) {
      return null;
  }

  return (
    <Card className="lg:col-span-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Simulador de Impacto Ambiental</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Seção de Entradas */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="impact-project-select" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Selecione o Projeto</label>
                    <select
                        id="impact-project-select"
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
                    <label htmlFor="impact-contribution-amount-input" className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                       <span>Valor do Aporte Hipotético</span>
                       <span className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-md">
                            {investmentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </label>
                    <input
                        id="impact-contribution-amount-input"
                        type="range"
                        min="100"
                        max="100000"
                        step="100"
                        value={investmentAmount}
                        onChange={handleAmountChange}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-brand-green"
                    />
                </div>
            </div>

            {/* Seção de Projeções */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">Seu impacto projetado ao longo de {selectedProject.term}:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <ResultCard 
                        icon={ICONS.co2}
                        label="Total de CO₂ Evitado"
                        value={`${projectedTotalCO2Avoided.toFixed(1).replace('.',',')} kg`}
                    />
                     <ResultCard 
                        icon={ICONS.kwh}
                        label="Total de Energia Limpa Gerada"
                        value={`${(projectedTotalKWhGenerated / 1000).toFixed(1).replace('.',',')} MWh`}
                    />
                </div>
                <div className="mt-3">
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                        *As projeções são estimativas baseadas nos dados do projeto selecionado e não representam garantias.
                    </p>
                </div>
            </div>
        </div>
    </Card>
  );
};

export default ImpactSimulator;