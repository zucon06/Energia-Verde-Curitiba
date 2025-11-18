import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { useMockData } from '../hooks/useMockData';
import type { Project, ProjectDocument } from '../types';
import { ICONS } from '../constants';
import InvestmentSimulator from '../components/projects/InvestmentSimulator';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import Tooltip from '../components/ui/Tooltip';
import ProjectCardSkeleton from '../components/projects/ProjectCardSkeleton';
import ProjectComparisonModal from '../components/projects/ProjectComparisonModal';

const Metric: React.FC<{
    // FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    // FIX: Changed icon type to React.ReactElement<any> to resolve overload error when using React.cloneElement.
    icon: React.ReactElement<any>;
    label: string | React.ReactNode;
    value: string | number;
    valueClassName?: string;
}> = ({ icon, label, value, valueClassName = 'text-gray-900 dark:text-white' }) => (
    <div className="flex space-x-2 items-start">
        <div className="text-gray-500 dark:text-gray-400 pt-0.5">{React.cloneElement(icon, {className: "h-4 w-4"})}</div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-tight">{label}</p>
            <p className={`font-semibold text-sm leading-tight ${valueClassName}`}>{value}</p>
        </div>
    </div>
);

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    onCompareToggle: (id: string) => void;
    isSelectedForCompare: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onCompareToggle, isSelectedForCompare }) => {
    const [ref, isVisible] = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });
    const fundingPercentage = (project.fundingRaised / project.fundingGoal) * 100;
    const termInYears = parseInt(project.term, 10) || 0;
    const estimatedRoi = project.apy * termInYears;
    const imageUrl = project.image || 'https://via.placeholder.com/400x300.png?text=Energia+Verde';

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    };
    
    const handleCompareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCompareToggle(project.id);
    };

    return (
        <Card 
            ref={ref} 
            className={`relative overflow-hidden cursor-pointer group flex flex-col hover:-translate-y-1 transition-transform duration-300 p-0 ${isSelectedForCompare ? 'ring-2 ring-brand-blue' : ''}`} 
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalhes do projeto ${project.name}`}
            aria-pressed={isSelectedForCompare}
        >
            <button
                onClick={handleCompareClick}
                className={`absolute top-3 right-3 z-20 h-9 w-9 flex items-center justify-center rounded-full transition-all duration-300 ${isSelectedForCompare ? 'bg-brand-blue text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                aria-label={isSelectedForCompare ? `Remover ${project.name} da comparação` : `Adicionar ${project.name} à comparação`}
            >
                {isSelectedForCompare ? React.cloneElement(ICONS.check, { className: "h-5 w-5" }) : React.cloneElement(ICONS.plus, { className: "h-5 w-5" })}
            </button>

            <img src={imageUrl} alt={project.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-4 flex flex-col flex-1">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        {project.type === 'Solar' ? <span className="text-yellow-400">{ICONS.solar}</span> : <span className="text-cyan-400">{ICONS.wind}</span>}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{project.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{project.location}</p>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
                        <Metric 
                          icon={ICONS.money} 
                          label={
                            <div className="flex items-center gap-1">
                                Rent. Anual (APY)
                                <Tooltip text="Rendimento Percentual Anual: a taxa de retorno estimada do investimento em um ano.">
                                    <span tabIndex={0} className="cursor-help">{React.cloneElement(ICONS.info, { className: "h-3.5 w-3.5" })}</span>
                                </Tooltip>
                            </div>
                          } 
                          value={`${project.apy.toFixed(1)}%`} 
                          valueClassName="text-brand-green" 
                        />
                         <Metric 
                          icon={ICONS.myPortfolio} 
                          label={
                            <div className="flex items-center gap-1">
                                ROI Estimado
                                <Tooltip text="Retorno Sobre o Investimento: o ganho total estimado ao final do prazo do projeto.">
                                    <span tabIndex={0} className="cursor-help">{React.cloneElement(ICONS.info, { className: "h-3.5 w-3.5" })}</span>
                                </Tooltip>
                            </div>
                          } 
                          value={`${estimatedRoi.toFixed(0)}%`} 
                          valueClassName="text-brand-green" 
                        />
                        <Metric icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Prazo" value={project.term} />
                        <Metric icon={ICONS.target} label="Meta" value={project.fundingGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                        <Metric icon={ICONS.investors} label="Arrecadado" value={project.fundingRaised.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                        <Metric icon={ICONS.kwh} label="Energia/Ano" value={`${(project.kwhGeneratedPerYear / 1000).toFixed(0)} MWh`} />
                        <Metric icon={ICONS.co2} label="CO₂ Evitado/Ano" value={`${project.co2AvoidedPerYear} ton`} />
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Progresso</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{fundingPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                            className="bg-brand-green h-2.5 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: isVisible ? `${fundingPercentage}%` : '0%' }}>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
// FIX: Changed icon type to React.ReactElement<any> to resolve overload error when using React.cloneElement.
const ProjectionCard: React.FC<{ icon: React.ReactElement<any>; label: string; value: string; isHighlighted?: boolean }> = ({ icon, label, value, isHighlighted }) => (
    <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg ring-1 ring-gray-200 dark:ring-gray-700 flex items-center space-x-3">
        <div className={isHighlighted ? 'text-brand-green' : 'text-gray-500 dark:text-gray-400'}>{React.cloneElement(icon, { className: "h-5 w-5" })}</div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`font-bold text-sm ${isHighlighted ? 'text-brand-green' : 'text-gray-900 dark:text-white'}`}>{value}</p>
        </div>
    </div>
);

type ProjectDetailTab = 'details' | 'tokenomics' | 'documents';

interface ProjectDetailProps {
    project: Project;
}
// FIX: Complete the ProjectDetail component to return JSX, resolving the 'void' return type error.
const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
    const [investmentAmount, setInvestmentAmount] = useState(1000);
    const [activeTab, setActiveTab] = useState<ProjectDetailTab>('details');
    
    const remainingFunding = project.fundingGoal - project.fundingRaised;

    React.useEffect(() => {
        const defaultAmount = Math.min(1000, remainingFunding);
        setInvestmentAmount(defaultAmount > 0 ? defaultAmount : 0);
    }, [project.id, remainingFunding]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) value = 0;
        if (value > remainingFunding) value = remainingFunding;
        setInvestmentAmount(value);
    };

    const {
      projectedAnnualReturn,
      projectedTotalReturn,
      projectedTotalCO2Avoided,
    } = useMemo(() => {
        const termInYears = parseInt(project.term, 10) || 0;
        const annualReturn = investmentAmount * (project.apy / 100);
        const totalReturn = annualReturn * termInYears;
        const investmentShare = project.fundingGoal > 0 ? investmentAmount / project.fundingGoal : 0;
        const totalCO2Avoided = project.co2AvoidedPerYear * termInYears * investmentShare * 1000; // to kg

        return {
            projectedAnnualReturn: annualReturn,
            projectedTotalReturn: totalReturn,
            projectedTotalCO2Avoided: totalCO2Avoided,
        };
    }, [investmentAmount, project]);

    const imageUrl = project.image || 'https://via.placeholder.com/400x300.png?text=Energia+Verde';
    
    return (
        <div className="space-y-6">
            <img src={imageUrl} alt={project.name} className="w-full h-48 object-cover rounded-lg" />
            <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{project.location}</p>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>{project.description}</p>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Simule sua Participação</h4>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="participation-amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Valor da Participação (BRL)
                        </label>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-md px-3 py-1 ring-1 ring-transparent focus-within:ring-brand-green transition-all w-48">
                             <span className="text-gray-500 dark:text-gray-400 mr-2 font-semibold">R$</span>
                             <input
                                id="participation-input"
                                type="number"
                                min="0"
                                max={remainingFunding}
                                value={investmentAmount}
                                onChange={handleAmountChange}
                                className="bg-transparent border-none focus:ring-0 text-right font-bold text-lg text-gray-900 dark:text-white w-full p-0 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                             />
                        </div>
                    </div>
                    <input
                        id="participation-amount"
                        type="range"
                        min="0"
                        max={remainingFunding}
                        step="100"
                        value={investmentAmount}
                        onChange={handleAmountChange}
                        disabled={remainingFunding <= 0}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-brand-green disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                     {remainingFunding > 0 ? (
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>R$ 0</span>
                            <span>{remainingFunding.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-yellow-500 mt-2">Financiamento concluído!</p>
                    )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                         <ProjectionCard 
                            icon={ICONS.myPortfolio} 
                            label="Rendimento Anual" 
                            value={projectedAnnualReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        />
                        <ProjectionCard 
                            icon={ICONS.money} 
                            label="Ganhos Totais (no prazo)" 
                            value={projectedTotalReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                            isHighlighted 
                        />
                        <ProjectionCard 
                            icon={ICONS.co2} 
                            label="Impacto CO₂ (Total)" 
                            value={`${projectedTotalCO2Avoided.toFixed(2).replace('.',',')} kg`} 
                            isHighlighted 
                        />
                    </div>
                </div>
                <button
                    disabled={remainingFunding <= 0 || investmentAmount <= 0}
                    className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Adquirir {investmentAmount > 0 ? investmentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Documentos</h4>
                <ul className="space-y-2">
                    {project.documents.map((doc: ProjectDocument) => (
                        <li key={doc.name}>
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-500">{ICONS.profileInfo}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{doc.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{doc.size}</span>
                                    <span className="text-brand-blue">{ICONS.download}</span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const Transactions: React.FC = () => {
    const { projects } = useMockData();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // Filters State
    const [typeFilter, setTypeFilter] = useState<'all' | 'Solar' | 'Eólica'>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [apyFilter, setApyFilter] = useState('all');
    const [termFilter, setTermFilter] = useState('all');
    const [sortBy, setSortBy] = useState('apy_desc');

    // Comparison State
    const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        if (location.state && location.state.openProject && !selectedProject) {
            const projectToOpen = projects.find(p => p.id === location.state.openProject);
            if (projectToOpen) {
                setSelectedProject(projectToOpen);
                setIsDetailModalOpen(true);
            }
        }
    }, [location.state, projects, selectedProject]);

    const handleCardClick = (project: Project) => {
        setSelectedProject(project);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300); 
        if (location.state && location.state.openProject) {
            navigate(location.pathname, { replace: true, state: null });
        }
    };
    
    const handleCompareToggle = (projectId: string) => {
        setSelectedForCompare(current => {
            if (current.includes(projectId)) {
                return current.filter(id => id !== projectId);
            }
            return [...current, projectId];
        });
    };

    const uniqueLocations = useMemo(() => ['all', ...new Set(projects.map(p => p.location.split(',')[0]))], [projects]);

    const filteredAndSortedProjects = useMemo(() => {
        let processedProjects = [...projects];

        // Type filter
        if (typeFilter !== 'all') {
            processedProjects = processedProjects.filter(p => p.type === typeFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            processedProjects = processedProjects.filter(p => {
                const isFunded = p.fundingRaised >= p.fundingGoal;
                if (statusFilter === 'open') return !isFunded;
                if (statusFilter === 'funded') return isFunded;
                return true;
            });
        }
        
        // Location filter
        if (locationFilter !== 'all') {
            processedProjects = processedProjects.filter(p => p.location.startsWith(locationFilter));
        }
        
        // APY filter
        if (apyFilter !== 'all') {
            if (apyFilter === 'high') processedProjects = processedProjects.filter(p => p.apy >= 12);
            if (apyFilter === 'low') processedProjects = processedProjects.filter(p => p.apy < 12);
        }
        
        // Term filter
        if (termFilter !== 'all') {
            const termYears = parseInt(termFilter, 10);
            processedProjects = processedProjects.filter(p => {
                const projectTerm = parseInt(p.term, 10);
                if (termYears === 10) return projectTerm <= 10;
                if (termYears === 11) return projectTerm > 10;
                return true;
            });
        }
        
        // Sorting
        processedProjects.sort((a, b) => {
            switch (sortBy) {
                case 'apy_desc': return b.apy - a.apy;
                case 'term_asc': return parseInt(a.term, 10) - parseInt(b.term, 10);
                case 'goal_desc': return b.fundingGoal - a.fundingGoal;
                case 'raised_desc': return b.fundingRaised - a.fundingRaised;
                default: return 0;
            }
        });
        
        return processedProjects;
    }, [typeFilter, statusFilter, locationFilter, apyFilter, termFilter, sortBy, projects]);
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Projetos Disponíveis para Participação</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Participe de projetos de energia sustentável em Curitiba e obtenha retornos enquanto ajuda o planeta.</p>
            </div>

            <InvestmentSimulator projects={projects} />

            <Card className="p-4">
                <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white shrink-0">Oportunidades</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                        {/* Type Filter */}
                        <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                            <button onClick={() => setTypeFilter('all')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${typeFilter === 'all' ? 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}>Todos</button>
                            <button onClick={() => setTypeFilter('Solar')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${typeFilter === 'Solar' ? 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}>Solar</button>
                            <button onClick={() => setTypeFilter('Eólica')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${typeFilter === 'Eólica' ? 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}>Eólica</button>
                        </div>
                        
                        {/* Advanced Filters */}
                        <div className="flex items-center gap-2">
                           <label htmlFor="status-filter" className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</label>
                            <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg p-1.5 border-transparent focus:ring-2 focus:ring-brand-green">
                                <option value="all">Todos</option>
                                <option value="open">Abertos</option>
                                <option value="funded">Financiados</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                           <label htmlFor="location-filter" className="text-sm font-medium text-gray-500 dark:text-gray-400">Local:</label>
                            <select id="location-filter" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg p-1.5 border-transparent focus:ring-2 focus:ring-brand-green">
                                {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc === 'all' ? 'Todos' : loc}</option>)}
                            </select>
                        </div>
                         <div className="flex items-center gap-2">
                           <label htmlFor="apy-filter" className="text-sm font-medium text-gray-500 dark:text-gray-400">APY:</label>
                            <select id="apy-filter" value={apyFilter} onChange={(e) => setApyFilter(e.target.value)} className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg p-1.5 border-transparent focus:ring-2 focus:ring-brand-green">
                                <option value="all">Qualquer</option>
                                <option value="high">Acima de 12%</option>
                                <option value="low">Abaixo de 12%</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                           <label htmlFor="term-filter" className="text-sm font-medium text-gray-500 dark:text-gray-400">Prazo:</label>
                            <select id="term-filter" value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg p-1.5 border-transparent focus:ring-2 focus:ring-brand-green">
                                <option value="all">Qualquer</option>
                                <option value="10">Até 10 anos</option>
                                <option value="11">Mais de 10 anos</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-by" className="text-sm font-medium text-gray-500 dark:text-gray-400">Ordenar por:</label>
                            <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg p-1.5 border-transparent focus:ring-2 focus:ring-brand-green">
                                <option value="apy_desc">Maior APY</option>
                                <option value="raised_desc">Mais Arrecadado</option>
                                <option value="goal_desc">Maior Meta</option>
                                <option value="term_asc">Menor Prazo</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
                ) : filteredAndSortedProjects.length > 0 ? (
                    filteredAndSortedProjects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onClick={() => handleCardClick(project)} 
                            onCompareToggle={handleCompareToggle}
                            isSelectedForCompare={selectedForCompare.includes(project.id)}
                        />
                    ))
                ) : (
                    <div className="md:col-span-2 xl:col-span-3 text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Nenhum projeto encontrado com os filtros selecionados.</p>
                    </div>
                )}
            </div>
            
            {selectedForCompare.length >= 2 && (
                <div className="sticky bottom-6 inset-x-0 flex justify-center z-40 animate-fade-in-up">
                    <button
                        onClick={() => setIsCompareModalOpen(true)}
                        className="bg-brand-blue text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 transition-transform hover:scale-105"
                    >
                        Comparar ({selectedForCompare.length}) Projetos
                    </button>
                </div>
            )}

            {selectedProject && (
                 <Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} title={selectedProject.name}>
                    <ProjectDetail project={selectedProject} />
                </Modal>
            )}
            
            <ProjectComparisonModal
                isOpen={isCompareModalOpen}
                onClose={() => setIsCompareModalOpen(false)}
                projects={projects.filter(p => selectedForCompare.includes(p.id))}
            />
        </div>
    );
};

export default Transactions;