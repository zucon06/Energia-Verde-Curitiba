// FIX: Reconstructed the file which was previously truncated. This adds the main Wallet component and its default export, resolving the module loading issue.
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { useMockData } from '../hooks/useMockData';
import type { DAOProposal } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../components/theme/ThemeContext';
import { useNotification } from '../components/notifications/NotificationContext';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import Tooltip from '../components/ui/Tooltip';
import { ICONS } from '../constants';
import Skeleton from '../components/ui/Skeleton';

const statusClasses = {
    Ativa: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400' },
    Aprovada: { text: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green' },
    Rejeitada: { text: 'text-brand-red', bg: 'bg-brand-red/10', border: 'border-brand-red' },
};

interface ProposalCardProps {
    proposal: DAOProposal;
    onVote: (proposalId: string, voteType: 'for' | 'against') => void;
    onOpenDetails: (proposal: DAOProposal) => void;
    votingPower: number;
}

const ProposalCardSkeleton: React.FC = () => (
    <Card className="border-l-4 border-gray-300 dark:border-gray-600">
        <div className="flex justify-between items-start">
            <div>
                <Skeleton className="h-5 w-64 rounded" />
                <Skeleton className="h-4 w-80 rounded mt-2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
             <div className="flex justify-between text-sm mb-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className="h-3 w-full rounded-full mb-4" />
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                </div>
                <div className="flex space-x-2">
                    <Skeleton className="h-9 w-20 rounded-lg" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
            </div>
        </div>
    </Card>
);

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onVote, onOpenDetails, votingPower }) => {
    const [ref] = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });
    const [voted, setVoted] = useState(false);
    const [voteChoice, setVoteChoice] = useState<'for' | 'against' | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [liveAnnouncement, setLiveAnnouncement] = useState('');
    const [hoverVote, setHoverVote] = useState<'for' | 'against' | null>(null);

    const statusStyle = statusClasses[proposal.status];

    const handleVoteClick = (voteType: 'for' | 'against') => {
        if (voted) return;
        onVote(proposal.id, voteType);
        setVoted(true);
        setVoteChoice(voteType);
        setShowConfirmation(true);
        setLiveAnnouncement('Voto computado com sucesso.');
        setTimeout(() => {
            setShowConfirmation(false);
        }, 2000); // Confirmation icon disappears after 2 seconds
    };
    
    // --- Real-time Vote Preview Calculations ---
    const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    const previewTotal = total > 0 ? total + votingPower : votingPower;

    // Current state
    const forPercentage = total > 0 ? (proposal.votesFor / total) * 100 : 0;
    const againstPercentage = total > 0 ? (proposal.votesAgainst / total) * 100 : 0;

    // Preview state for hover effect
    const previewForPercentage = previewTotal > 0 ? ((proposal.votesFor + votingPower) / previewTotal) * 100 : 100;
    const previewAgainstPercentage = previewTotal > 0 ? ((proposal.votesAgainst + votingPower) / previewTotal) * 100 : 100;
    
    // Dynamically choose which values to display based on hover and vote status
    const isForHovered = hoverVote === 'for' && !voted;
    const isAgainstHovered = hoverVote === 'against' && !voted;

    const displayForPercentage = isForHovered ? previewForPercentage : forPercentage;
    const displayAgainstPercentage = isAgainstHovered ? previewAgainstPercentage : againstPercentage;
    
    const displayForVotes = isForHovered ? proposal.votesFor + votingPower : proposal.votesFor;
    const displayAgainstVotes = isAgainstHovered ? proposal.votesAgainst + votingPower : proposal.votesAgainst;
    // --- End Calculations ---


    return (
        <Card ref={ref} className={`border-l-4 ${statusStyle.border}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{proposal.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{proposal.summary}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>{proposal.status}</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {proposal.status === 'Ativa' ? (
                     <div>
                        <div className="flex justify-between text-sm mb-2">
                            <div className="flex items-baseline gap-2">
                               <span className="font-semibold text-brand-green">A Favor {displayForVotes.toLocaleString('pt-BR')} ({displayForPercentage.toFixed(1)}%)</span>
                               <span className={`text-xs text-brand-green transition-opacity duration-300 ${isForHovered ? 'opacity-100' : 'opacity-0'}`}>
                                   (+{votingPower.toLocaleString('pt-BR')} VP)
                               </span>
                           </div>
                           <div className="flex items-baseline gap-2">
                               <span className={`text-xs text-brand-red transition-opacity duration-300 ${isAgainstHovered ? 'opacity-100' : 'opacity-0'}`}>
                                   (+{votingPower.toLocaleString('pt-BR')} VP)
                               </span>
                               <span className="font-semibold text-brand-red">Contra {displayAgainstVotes.toLocaleString('pt-BR')} ({displayAgainstPercentage.toFixed(1)}%)</span>
                           </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                            <div 
                                className={`h-full absolute left-0 top-0 bg-brand-green transition-all duration-300`}
                                style={{ width: `${displayForPercentage}%` }}
                            ></div>
                             <div 
                                className={`h-full absolute right-0 top-0 bg-brand-red transition-all duration-300`}
                                style={{ width: `${displayAgainstPercentage}%` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-white mix-blend-difference">
                                    {total.toLocaleString('pt-BR')} Votos
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <button 
                                onClick={() => onOpenDetails(proposal)}
                                className="text-sm font-semibold text-brand-blue hover:underline"
                            >
                                Ver Detalhes
                            </button>
                            <div className="flex space-x-2 items-center">
                               {showConfirmation && (
                                   <div className="p-2 bg-brand-green/20 rounded-full text-brand-green animate-fade-in-out" aria-live="polite">
                                        {ICONS.check}
                                        <span className="sr-only">{liveAnnouncement}</span>
                                   </div>
                                )}
                                <button
                                    onClick={() => handleVoteClick('for')}
                                    onMouseEnter={() => setHoverVote('for')}
                                    onMouseLeave={() => setHoverVote(null)}
                                    disabled={voted}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                                        voted && voteChoice !== 'for' ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 opacity-60' : 'bg-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                                >
                                    Votar a Favor
                                </button>
                                <button
                                    onClick={() => handleVoteClick('against')}
                                    onMouseEnter={() => setHoverVote('against')}
                                    onMouseLeave={() => setHoverVote(null)}
                                    disabled={voted}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                                        voted && voteChoice !== 'against' ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 opacity-60' : 'bg-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                                >
                                    Votar Contra
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Votação encerrada.</span>
                        <button 
                            onClick={() => onOpenDetails(proposal)}
                            className="text-sm font-semibold text-brand-blue hover:underline"
                        >
                            Ver Resultado
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};

const Wallet: React.FC = () => {
    const { daoProposals, userPortfolio } = useMockData();
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(true);
    const [proposals, setProposals] = useState(daoProposals);
    const [filter, setFilter] = useState<'Todas' | 'Ativa' | 'Aprovada' | 'Rejeitada'>('Ativa');
    const [selectedProposal, setSelectedProposal] = useState<DAOProposal | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleOpenDetails = (proposal: DAOProposal) => {
        setSelectedProposal(proposal);
    };

    const handleCloseDetails = () => {
        setSelectedProposal(null);
    };

    const handleVote = (proposalId: string, voteType: 'for' | 'against') => {
        setProposals(currentProposals =>
            currentProposals.map(p => {
                if (p.id === proposalId) {
                    const newVotesFor = voteType === 'for' ? p.votesFor + userPortfolio.votingPower : p.votesFor;
                    const newVotesAgainst = voteType === 'against' ? p.votesAgainst + userPortfolio.votingPower : p.votesAgainst;
                    return { ...p, votesFor: newVotesFor, votesAgainst: newVotesAgainst };
                }
                return p;
            })
        );
        showNotification();
    };

    const filteredProposals = proposals.filter(p => filter === 'Todas' || p.status === filter);
    
    const axisStrokeColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
    const gridStrokeColor = theme === 'dark' ? '#3e3e3e' : '#e5e7eb';
    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#3e3e3e' : '#e5e7eb'}`,
    };

    const votingData = [
        { name: 'A Favor', value: selectedProposal?.votesFor, fill: '#22c55e' },
        { name: 'Contra', value: selectedProposal?.votesAgainst, fill: '#ef4444' },
        { name: 'Abstenções', value: selectedProposal?.votesAbstain, fill: '#6b7280' },
    ];
    
    const filterButtons: ('Todas' | 'Ativa' | 'Aprovada' | 'Rejeitada')[] = ['Todas', 'Ativa', 'Aprovada', 'Rejeitada'];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Governança da Comunidade (DAO)</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Participe das decisões, vote em propostas e ajude a moldar o futuro da plataforma.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 text-brand-blue rounded-lg">{ICONS.dao}</div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Seu Poder de Voto</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{userPortfolio.votingPower.toLocaleString('pt-BR')} VP</p>
                    </div>
                </Card>
                 <Card className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 text-yellow-400">{ICONS.projects}</div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Propostas Ativas</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{daoProposals.filter(p => p.status === 'Ativa').length}</p>
                    </div>
                </Card>
            </div>
            
            <Card className="p-2">
                <div className="flex flex-wrap items-center gap-2">
                    {filterButtons.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                filter === f ? 'bg-brand-green text-white shadow' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </Card>

            <div className="space-y-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <ProposalCardSkeleton key={i} />)
                ) : filteredProposals.length > 0 ? (
                    filteredProposals.map(proposal => (
                        <ProposalCard 
                            key={proposal.id} 
                            proposal={proposal} 
                            onVote={handleVote} 
                            onOpenDetails={handleOpenDetails}
                            votingPower={userPortfolio.votingPower}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Nenhuma proposta encontrada com o filtro selecionado.</p>
                    </div>
                )}
            </div>

            <Modal 
                isOpen={!!selectedProposal} 
                onClose={handleCloseDetails} 
                title={selectedProposal?.title || 'Detalhes da Proposta'}
                maxWidth="max-w-3xl"
            >
                {selectedProposal && (
                    <div className="space-y-6">
                        <div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[selectedProposal.status].bg} ${statusClasses[selectedProposal.status].text}`}>{selectedProposal.status}</span>
                            <p className="mt-3 text-gray-600 dark:text-gray-300">{selectedProposal.summary}</p>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: selectedProposal.details }} />

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                             <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resultado da Votação</h4>
                             <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={votingData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} horizontal={false} />
                                        <XAxis type="number" stroke={axisStrokeColor} tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
                                        <YAxis type="category" dataKey="name" stroke={axisStrokeColor} width={80} />
                                        <RechartsTooltip 
                                            contentStyle={tooltipStyle}
                                            formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Votos']}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Wallet;
