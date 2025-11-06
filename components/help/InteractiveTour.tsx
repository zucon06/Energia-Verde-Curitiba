import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../../constants';

const tourSteps = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0" /></svg>,
    title: 'Bem-vindo à Energia Verde Curitiba!',
    text: 'Este tour rápido irá guiá-lo pelas funcionalidades essenciais da nossa plataforma. Pronto para começar a investir num futuro mais verde?',
    link: null,
    linkText: ''
  },
  {
    icon: ICONS.projects,
    title: 'Explore e Invista em Projetos',
    text: "Na seção 'Projetos', você encontra oportunidades de investimento em energia solar e eólica. Analise a rentabilidade, o impacto ambiental e use o simulador para projetar seus ganhos.",
    link: '/projetos',
    linkText: 'Explorar Projetos'
  },
  {
    icon: ICONS.myPortfolio,
    title: 'Acompanhe Seu Portfólio',
    text: "Em 'Meu Portfólio', você tem uma visão completa dos seus ativos: valor total investido, rendimentos, impacto de CO₂ evitado e o histórico detalhado de todas as suas transações.",
    link: '/meu-portfolio',
    linkText: 'Ver Meu Portfólio'
  },
  {
    icon: ICONS.dao,
    title: 'Participe da Governança (DAO)',
    text: "Na seção 'DAO', sua voz tem poder. Use seus tokens para votar em propostas importantes e ajude a decidir os rumos da plataforma, como a aprovação de novos projetos.",
    link: '/dao',
    linkText: 'Ir para a DAO'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Você está Pronto!',
    text: 'Agora você já conhece o essencial para começar. Explore a plataforma, invista no futuro sustentável de Curitiba e veja seu impacto e seus rendimentos crescerem juntos.',
    link: null,
    linkText: ''
  },
];

interface InteractiveTourProps {
    onComplete: () => void;
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const step = tourSteps[currentStep];

  const goToNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoToSection = () => {
    if (step.link) {
        navigate(step.link);
        onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="text-center">
        <div className="flex items-center justify-center h-24 w-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/50 rounded-full">
            {React.cloneElement(step.icon, { className: 'h-12 w-12 text-brand-green' })}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h2>
        <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400 mb-8">{step.text}</p>
      </div>

      <div className="flex items-center justify-center space-x-2 mb-8">
        {tourSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentStep === index ? 'bg-brand-green scale-125' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            }`}
            aria-label={`Ir para o passo ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        {currentStep > 0 && (
          <button
            onClick={goToPrevStep}
            className="w-full sm:w-auto text-center font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
          >
            Anterior
          </button>
        )}
        
        {currentStep < tourSteps.length - 1 ? (
          <button
            onClick={goToNextStep}
            className="w-full sm:w-auto text-center font-semibold text-white bg-brand-green hover:bg-green-600 px-6 py-3 rounded-lg transition-colors"
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full sm:w-auto text-center font-semibold text-white bg-brand-green hover:bg-green-600 px-6 py-3 rounded-lg transition-colors"
          >
            Concluir Tour
          </button>
        )}
      </div>

       {step.link && (
        <button
            onClick={handleGoToSection}
            className="mt-6 text-sm font-semibold text-brand-blue hover:underline"
        >
            {step.linkText}
        </button>
       )}
    </div>
  );
};

export default InteractiveTour;