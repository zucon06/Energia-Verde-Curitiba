import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserTransaction, Project } from '../../types';
import Modal from '../ui/Modal';
import { ICONS } from '../../constants';

interface TransactionHistoryTableProps {
  transactions: UserTransaction[];
  projects: Project[];
}

// FIX: Changed icon type to JSX.Element to correctly type props for React.cloneElement, resolving an overload error.
// FIX: Changed icon type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
// FIX: Changed icon type to React.ReactElement<any> to resolve overload error when using React.cloneElement.
const DetailRow: React.FC<{ icon: React.ReactElement<any>; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex justify-between items-center py-2">
        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
            {React.cloneElement(icon, { className: 'h-5 w-5' })}
            <span className="text-sm">{label}</span>
        </div>
        <div className="font-semibold text-sm text-gray-900 dark:text-white text-right">{children}</div>
    </div>
);


const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ transactions, projects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<UserTransaction | null>(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;

  const handleRowClick = (tx: UserTransaction) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing to allow for modal-out animation
    setTimeout(() => setSelectedTx(null), 300);
  };

  const handleGoToProject = (projectName: string) => {
    const project = projects.find(p => p.name === projectName);
    if (project) {
      navigate('/projetos', { state: { openProject: project.id } });
      handleCloseModal();
    }
  };

  // Sort transactions by date descending
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const getTypeChip = (type: 'Investimento' | 'Rendimento') => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block';
    if (type === 'Investimento') {
      return <span className={`${baseClasses} bg-blue-400/20 text-blue-400`}>Investimento</span>;
    }
    return <span className={`${baseClasses} bg-brand-green/20 text-brand-green`}>Rendimento</span>;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Adding timeZone to avoid off-by-one day errors
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Projeto</th>
              <th scope="col" className="px-6 py-3">Tipo</th>
              <th scope="col" className="px-6 py-3 text-right">Valor</th>
              <th scope="col" className="px-6 py-3 text-right">Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentTransactions.map((tx) => (
              <tr 
                key={tx.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors cursor-pointer"
                onClick={() => handleRowClick(tx)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRowClick(tx)}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalhes da transação ${tx.id}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(tx.date)}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tx.project}</td>
                <td className="px-6 py-4">{getTypeChip(tx.type)}</td>
                <td className={`px-6 py-4 text-right font-semibold ${tx.type === 'Rendimento' ? 'text-brand-green' : 'text-gray-900 dark:text-white'}`}>
                    {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="px-6 py-4 text-right">{tx.tokens > 0 ? tx.tokens.toLocaleString('pt-BR') : '-'}</td>
              </tr>
            ))}
             {currentTransactions.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Próximo
          </button>
        </div>
      )}

      {selectedTx && (
        <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            title={`Detalhes da Transação`}
        >
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <p className={`text-3xl font-bold ${selectedTx.type === 'Rendimento' ? 'text-brand-green' : 'text-gray-900 dark:text-white'}`}>
                        {selectedTx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valor da Transação</p>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <DetailRow icon={ICONS.idCard} label="ID da Transação">
                        <span>{selectedTx.id}</span>
                    </DetailRow>
                    <DetailRow icon={ICONS.calendar} label="Data">
                        <span>{formatDate(selectedTx.date)}</span>
                    </DetailRow>
                    <DetailRow icon={ICONS.projects} label="Projeto">
                        <span>{selectedTx.project}</span>
                    </DetailRow>
                    <DetailRow icon={ICONS.myPortfolio} label="Tipo">
                       {getTypeChip(selectedTx.type)}
                    </DetailRow>
                    <DetailRow icon={ICONS.target} label="Tokens">
                        <span>{selectedTx.tokens > 0 ? selectedTx.tokens.toLocaleString('pt-BR') : 'N/A'}</span>
                    </DetailRow>
                     <DetailRow icon={ICONS.security} label="Status">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-brand-green/10 text-brand-green">{selectedTx.status}</span>
                    </DetailRow>
                </div>
                
                 {projects.some(p => p.name === selectedTx.project) && (
                    <button 
                        onClick={() => handleGoToProject(selectedTx.project)}
                        className="w-full mt-2 bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Ver Projeto
                    </button>
                )}
            </div>
        </Modal>
      )}
    </div>
  );
};

export default TransactionHistoryTable;