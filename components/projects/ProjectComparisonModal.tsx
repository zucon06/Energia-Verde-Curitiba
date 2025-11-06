import React from 'react';
import Modal from '../ui/Modal';
import type { Project } from '../../types';
import { ICONS } from '../../constants';

interface ProjectComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
}

const ComparisonRow: React.FC<{ label: React.ReactNode; values: React.ReactNode[]; isHighlighted?: boolean }> = ({ label, values, isHighlighted }) => (
    <tr className={`border-b border-gray-200 dark:border-gray-700 ${isHighlighted ? 'bg-green-50 dark:bg-green-900/30' : ''}`}>
        <th scope="row" className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-left sticky left-0 bg-white dark:bg-gray-800 align-middle">
            {label}
        </th>
        {values.map((value, index) => (
            <td key={index} className="py-3 px-4 text-sm text-gray-900 dark:text-white text-center align-middle">
                {value}
            </td>
        ))}
    </tr>
);

const getValueColorClass = (currentValue: number, allValues: number[], higherIsBetter: boolean = true): string => {
    if (allValues.length <= 1) {
        return 'font-semibold';
    }

    const max = Math.max(...allValues);
    const min = Math.min(...allValues);

    if (currentValue === max && currentValue === min) { // All values are the same
        return 'font-semibold';
    }

    if (higherIsBetter) {
        if (currentValue === max) return 'font-bold text-green-400';
        if (currentValue === min) return 'font-semibold text-red-400';
    } else { // lowerIsBetter
        if (currentValue === min) return 'font-bold text-green-400';
        if (currentValue === max) return 'font-semibold text-red-400';
    }

    return 'font-semibold text-yellow-400';
};


const ProjectComparisonModal: React.FC<ProjectComparisonModalProps> = ({ isOpen, onClose, projects }) => {
    if (!projects || projects.length < 2) {
        return null;
    }
    
    const termInYears = (term: string) => parseInt(term, 10) || 0;

    // Pre-calculate all values for color scaling
    const allApys = projects.map(p => p.apy);
    const allRois = projects.map(p => p.apy * termInYears(p.term));

    // Calculate best values for highlighting
    const minTerm = Math.min(...projects.map(p => termInYears(p.term)));
    const maxCo2 = Math.max(...projects.map(p => p.co2AvoidedPerYear));
    const maxEnergy = Math.max(...projects.map(p => p.kwhGeneratedPerYear));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Comparar Projetos" maxWidth="max-w-7xl">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                            <th className="py-3 px-4 text-sm font-bold text-gray-900 dark:text-white text-left sticky left-0 bg-white dark:bg-gray-800 align-bottom">Métrica</th>
                            {projects.map(p => (
                                <th key={p.id} className="py-3 px-4 text-sm font-bold text-gray-900 dark:text-white text-center">
                                    <div className="flex flex-col items-center">
                                        <img src={p.image} alt={p.name} className="w-16 h-12 object-cover rounded-md mb-2" />
                                        <span>{p.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <ComparisonRow
                            label={<div className="flex items-center gap-2">{ICONS.money} <span>APY (Rent. Anual)</span></div>}
                            values={projects.map(p => (
                                <span className={getValueColorClass(p.apy, allApys)}>
                                    {p.apy.toFixed(1)}%
                                </span>
                            ))}
                        />
                         <ComparisonRow
                            label={<div className="flex items-center gap-2">{ICONS.myPortfolio} <span>ROI Estimado Total</span></div>}
                            values={projects.map(p => {
                                const roi = p.apy * termInYears(p.term);
                                return (
                                    <span className={getValueColorClass(roi, allRois)}>
                                        {roi.toFixed(0)}%
                                    </span>
                                );
                            })}
                        />
                         <ComparisonRow
                            label={<div className="flex items-center gap-2">{React.cloneElement(ICONS.calendar, {className: "w-4 h-4"})}<span>Prazo</span></div>}
                            values={projects.map(p => {
                                const term = termInYears(p.term);
                                // Shorter term is better, so highlight the minimum
                                return (
                                    <span className={term === minTerm ? "font-bold text-brand-green" : ""}>
                                        {p.term}
                                    </span>
                                );
                            })}
                        />
                        <ComparisonRow
                            label={<div className="flex items-center gap-2">{ICONS.target} <span>Meta de Financiamento</span></div>}
                            values={projects.map(p => p.fundingGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }))}
                        />
                         <ComparisonRow
                            label={<div className="flex items-center gap-2">{ICONS.investors} <span>Valor Arrecadado</span></div>}
                            values={projects.map(p => (
                                <div>
                                    <p>{p.fundingRaised.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}</p>
                                    <p className="text-xs text-gray-500">{((p.fundingRaised / p.fundingGoal) * 100).toFixed(0)}%</p>
                                </div>
                            ))}
                        />
                        <ComparisonRow
                            label={<div className="flex items-center gap-2">{ICONS.co2} <span>CO₂ Evitado por Ano</span></div>}
                            values={projects.map(p => (
                                 <span className={p.co2AvoidedPerYear === maxCo2 ? "font-bold text-brand-green" : ""}>
                                    {p.co2AvoidedPerYear.toLocaleString('pt-BR')} ton
                                 </span>
                            ))}
                        />
                         <ComparisonRow
                            label={<div className="flex items-center gap-2">{ICONS.kwh} <span>Energia Gerada por Ano</span></div>}
                            values={projects.map(p => (
                                <span className={p.kwhGeneratedPerYear === maxEnergy ? "font-bold text-brand-green" : ""}>
                                    {(p.kwhGeneratedPerYear / 1000).toLocaleString('pt-BR')} MWh
                                </span>
                            ))}
                        />
                         <ComparisonRow
                            label={<div className="flex items-center gap-2">{ICONS.kwh} <span>Tipo</span></div>}
                            values={projects.map(p => p.type)}
                        />
                        <ComparisonRow
                            label={<div className="flex items-center gap-2">{ICONS.location} <span>Localização</span></div>}
                            values={projects.map(p => p.location)}
                        />
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export default ProjectComparisonModal;