import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { useAnimateOnScroll } from '../../hooks/useAnimateOnScroll';
import { useCountUp } from '../../hooks/useCountUp';
import { ICONS } from '../../constants';

interface ESGScoreCardProps {
  co2Impact: number; // in kg
  kwhGenerated: number; // in kWh
  socialImpactScore: number; // 0-100
  governanceActivityScore: number; // 0-100
  averageESGScore: number;
}

const ESGScoreCard: React.FC<ESGScoreCardProps> = ({ co2Impact, kwhGenerated, socialImpactScore, governanceActivityScore, averageESGScore }) => {
  const [ref, isVisible] = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.3, triggerOnce: true });

  const score = useMemo(() => {
    // --- Environmental Score ---
    const CO2_BENCHMARK_KG = 500;
    const KWH_BENCHMARK = 2500;
    const co2Score = Math.min((co2Impact / CO2_BENCHMARK_KG) * 100, 100);
    const energyScore = Math.min((kwhGenerated / KWH_BENCHMARK) * 100, 100);
    const environmentalScore = (co2Score * 0.6) + (energyScore * 0.4);

    // --- Social & Governance Scores ---
    // These are already provided as scores from 0-100 in the mock data
    // For a real app, you might calculate them here based on user actions
    const socialScoreNormalized = Math.min((socialImpactScore / 75) * 100, 100); // Target a score of 75 as 100%
    const governanceScoreNormalized = Math.min((governanceActivityScore / 90) * 100, 100); // Target 90 as 100%

    // --- Final Weighted Score ---
    const E_WEIGHT = 0.5;
    const S_WEIGHT = 0.25;
    const G_WEIGHT = 0.25;

    const finalScore = (environmentalScore * E_WEIGHT) + (socialScoreNormalized * S_WEIGHT) + (governanceScoreNormalized * G_WEIGHT);
    
    return Math.round(finalScore);
  }, [co2Impact, kwhGenerated, socialImpactScore, governanceActivityScore]);

  const animatedScore = useCountUp(isVisible ? score : 0, 1500);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((isVisible ? animatedScore : 0) / 100) * circumference;
  
  const scoreDifference = Math.round(animatedScore) - averageESGScore;
  const isAboveAverage = scoreDifference > 0;
  const isAverage = scoreDifference === 0;

  let benchmarkMessage, Icon, colorClass;

  if (!isVisible) {
      benchmarkMessage = null;
  } else if (isAverage) {
      benchmarkMessage = `Seu score está na média da comunidade. Continue assim!`;
      Icon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5.5 8m7 2H5M7 20l4-4m-4 4v-6" /></svg>;
      colorClass = 'text-blue-500 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50';
  } else if (isAboveAverage) {
      benchmarkMessage = `Você está ${Math.abs(scoreDifference)} pontos acima da média. Parabéns!`;
      Icon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>;
      colorClass = 'text-brand-green bg-green-100 dark:text-green-300 dark:bg-green-900/50';
  } else {
      benchmarkMessage = `Você está ${Math.abs(scoreDifference)} pontos abaixo da média. Continue investindo!`;
      Icon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;
      colorClass = 'text-yellow-500 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50';
  }

  const tangibleEquivalents = useMemo(() => ({
    trees: (co2Impact / 22).toFixed(0), // Avg tree absorbs ~22kg CO2/year
    carKm: (kwhGenerated / 0.17).toLocaleString('pt-BR', { maximumFractionDigits: 0 }), // Avg EV uses ~0.17 kWh/km
    householdMonths: (kwhGenerated / 152).toFixed(1).replace('.', ','), // Avg Brazilian household uses 152 kWh/month
  }), [co2Impact, kwhGenerated]);


  return (
    <Card ref={ref}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="text-center lg:text-left flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Seu Score de Impacto ESG</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg">
            Esta é uma pontuação que representa seu impacto positivo, combinando métricas Ambientais (CO₂, energia), Sociais (investimentos comunitários) e de Governança (participação na DAO).
          </p>

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg text-left">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Seu impacto no mundo real:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-brand-green">{ICONS.co2}</div>
                    <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{tangibleEquivalents.trees} árvores</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">CO₂ salvo por ano</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-yellow-500">{ICONS.kwh}</div>
                    <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{tangibleEquivalents.carKm} km</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Em um carro elétrico</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-400">{ICONS.projects}</div>
                    <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{tangibleEquivalents.householdMonths} meses</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Energia para 1 casa</p>
                    </div>
                </div>
            </div>
          </div>
          
          {benchmarkMessage && (
            <div className={`mt-4 p-3 rounded-lg flex items-center space-x-3 ${colorClass} transition-opacity duration-500`}>
                <Icon />
                <p className="text-sm font-semibold">{benchmarkMessage}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative h-32 w-32 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 120 120" aria-label={`Medidor de Score ESG mostrando um valor de ${Math.round(animatedScore)} de 100`}>
              <circle
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="60"
                cy="60"
              />
              <circle
                className="text-brand-green"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="60"
                cy="60"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                className="text-2xl font-bold fill-current text-gray-900 dark:text-white"
                aria-live="polite"
              >
                {Math.round(animatedScore)}
              </text>
            </svg>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-brand-green">
                {ICONS.co2}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">CO₂ Evitado</p>
                <p className="font-bold text-gray-900 dark:text-white">{co2Impact.toFixed(1).replace('.',',')} kg</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-yellow-500">
                {ICONS.kwh}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Energia Gerada</p>
                <p className="font-bold text-gray-900 dark:text-white">{(kwhGenerated / 1000).toFixed(2).replace('.',',')} MWh</p>
              </div>
            </div>
             <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-400">
                {ICONS.investors}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Impacto Social</p>
                <p className="font-bold text-gray-900 dark:text-white">{socialImpactScore}/100 pts</p>
              </div>
            </div>
             <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-400">
                {ICONS.dao}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Governança</p>
                <p className="font-bold text-gray-900 dark:text-white">{governanceActivityScore}/100 pts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ESGScoreCard;