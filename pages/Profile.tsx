
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';
import { useTheme } from '../components/theme/ThemeContext';
import Switch from '../components/ui/Switch';
import { useMockData } from '../hooks/useMockData';
import Achievements from '../components/portfolio/Achievements';
import Modal from '../components/ui/Modal';
import type { Achievement } from '../types';

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, value, onClick }) => {
  const isButton = !!onClick;
  const commonClasses = "flex items-center justify-between py-3 px-4 rounded-lg transition-colors";
  const interactiveClasses = "hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer";
  
  const content = (
      <>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 dark:text-gray-400">{icon}</span>
          <span className="text-gray-900 dark:text-white font-medium">{label}</span>
        </div>
        {value && <span className="text-blue-400 font-semibold text-sm">{value}</span>}
      </>
  );

  if (isButton) {
      return (
        <button
          onClick={onClick}
          className={`${commonClasses} ${interactiveClasses} w-full`}
          aria-label={label}
        >
          {content}
        </button>
      );
  }

  return (
    <div className={commonClasses}>
        {content}
    </div>
  );
};

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center space-x-4">
        <span className="text-gray-500 dark:text-gray-400">{ICONS.theme}</span>
        <span className="text-gray-900 dark:text-white font-medium">Tema</span>
      </div>
      <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${
            theme === 'light' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-300/50'
          }`}
        >
          Claro
        </button>
        <button
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${
            theme === 'dark' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-600/50'
          }`}
        >
          Escuro
        </button>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
    const [prefs, setPrefs] = useState({
        newProjects: true,
        daoProposals: true,
        monthlySummary: false,
    });

    const handlePrefChange = (prefKey: keyof typeof prefs) => {
        setPrefs(currentPrefs => ({
            ...currentPrefs,
            [prefKey]: !currentPrefs[prefKey]
        }));
    };

    return (
        <Card className="p-2 space-y-1">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferências de Notificação</h3>
            </div>
            <div className="flex items-center justify-between py-3 px-4">
                <div className="flex items-center space-x-4">
                    <span className="text-gray-500 dark:text-gray-400">{ICONS.projects}</span>
                    <span className="text-gray-900 dark:text-white font-medium">Novos projetos disponíveis</span>
                </div>
                <Switch checked={prefs.newProjects} onChange={() => handlePrefChange('newProjects')} />
            </div>
            <div className="flex items-center justify-between py-3 px-4">
                <div className="flex items-center space-x-4">
                    <span className="text-gray-500 dark:text-gray-400">{ICONS.dao}</span>
                    <span className="text-gray-900 dark:text-white font-medium">Novas propostas na DAO</span>
                </div>
                <Switch checked={prefs.daoProposals} onChange={() => handlePrefChange('daoProposals')} />
            </div>
             <div className="flex items-center justify-between py-3 px-4">
                <div className="flex items-center space-x-4">
                    <span className="text-gray-500 dark:text-gray-400">{ICONS.myPortfolio}</span>
                    <span className="text-gray-900 dark:text-white font-medium">Resumo mensal do portfólio</span>
                </div>
                <Switch checked={prefs.monthlySummary} onChange={() => handlePrefChange('monthlySummary')} />
            </div>
        </Card>
    );
};


const Profile: React.FC = () => {
  const { userPortfolio, projects } = useMockData();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const user = { 
    name: 'Elon Musk', 
    title: 'Technoking',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/1200px-Elon_Musk_Royal_Society_%28crop2%29.jpg'
  };

  const handleAchievementClick = (achievement: Achievement) => {
      setSelectedAchievement(achievement);
  };

  const handleCloseAchievementModal = () => {
      setSelectedAchievement(null);
  };
  
  if (!user) {
    return null; // or a loading state
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Perfil e Configurações</h2>

      <Card className="text-center p-8">
        <div className="relative inline-block mb-4">
          <img
            className="h-28 w-28 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 bg-gray-200 dark:bg-gray-700"
            src={user.avatar} 
            alt={`Avatar de ${user.name}`}
          />
          <button
            className="absolute bottom-0 right-0 bg-blue-400 p-2 rounded-full text-white hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-400"
            aria-label="Editar foto do perfil"
          >
            {ICONS.profileEdit}
          </button>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{user.title}</p>
      </Card>
      
      <Achievements userPortfolio={userPortfolio} onAchievementClick={handleAchievementClick} projects={projects} />

      <Card className="p-2 space-y-1">
        <SettingsItem icon={ICONS.profileInfo} label="Editar informações do perfil" onClick={() => {}} />
        <SettingsItem icon={ICONS.security} label="Segurança e Senha" onClick={() => {}} />
        <SettingsItem icon={ICONS.language} label="Idioma" value="Português" />
      </Card>

      <NotificationSettings />

       <Card className="p-2 space-y-1">
        <ThemeSwitcher />
      </Card>
      
       <Card className="p-2 space-y-1">
        <SettingsItem icon={ICONS.helpSupport} label="Ajuda & Suporte" onClick={() => {}}/>
        <SettingsItem icon={ICONS.contact} label="Fale conosco" onClick={() => {}}/>
        <SettingsItem icon={ICONS.privacy} label="Política de privacidade" onClick={() => {}}/>
      </Card>

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

export default Profile;