import React from 'react';
import Card from '../ui/Card';
import { ICONS } from '../../constants';
import type { UserPortfolio, Achievement } from '../../types';
import { useMockData } from '../../hooks/useMockData';

interface AchievementsProps {
    userPortfolio: UserPortfolio;
    onAchievementClick: (achievement: Achievement) => void;
    projects: any[]; // Pass projects to calculate metrics like diversified investor
}

const Achievements: React.FC<AchievementsProps> = ({ userPortfolio, onAchievementClick, projects }) => {
    const { achievements: achievementsList } = useMockData();

    const processAchievement = (achievement: Achievement) => {
        const metricValue = achievement.getMetricValue?.(userPortfolio) ?? (userPortfolio[achievement.metric as keyof typeof userPortfolio] as number);

        let currentLevelIndex = -1;
        for (let i = achievement.levels.length - 1; i >= 0; i--) {
            if (metricValue >= achievement.levels[i].threshold) {
                currentLevelIndex = i;
                break;
            }
        }

        const currentLevel = currentLevelIndex > -1 ? achievement.levels[currentLevelIndex] : null;
        const nextLevel = achievement.levels[currentLevelIndex + 1] || null;
        const isMaxLevel = currentLevel !== null && nextLevel === null;

        let progressPercentage = 0;
        if (nextLevel) {
            const prevThreshold = currentLevel?.threshold || 0;
            progressPercentage = Math.min(((metricValue - prevThreshold) / (nextLevel.threshold - prevThreshold)) * 100, 100);
        } else if (isMaxLevel) {
            progressPercentage = 100;
        }

        return {
            currentLevel,
            nextLevel,
            progressPercentage,
            isMaxLevel,
            currentValue: metricValue,
        };
    };

    return (
        <Card>
            <div className="flex items-center mb-4">
                <span className="text-brand-green">{ICONS.achievements}</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">Conquistas e Marcos</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievementsList.map(achievement => {
                    const { currentLevel, nextLevel, progressPercentage, isMaxLevel } = processAchievement(achievement);
                    const unlocked = currentLevel !== null;

                    return (
                        <button 
                            key={achievement.id} 
                            onClick={() => onAchievementClick(achievement)}
                            className={`p-4 rounded-xl transition-all text-left w-full hover:shadow-lg hover:-translate-y-1 duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex flex-col justify-between ${
                                unlocked 
                                ? 'bg-green-50 dark:bg-green-900/40 ring-1 ring-green-200 dark:ring-green-500/30' 
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                            aria-label={`Ver detalhes da conquista: ${achievement.title}`}
                        >
                            <div>
                                <div className="flex items-start space-x-4">
                                    <div className={`shrink-0 p-2 rounded-lg ${
                                        unlocked 
                                        ? 'bg-brand-green/20 text-brand-green'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                    }`}>
                                        {React.cloneElement(achievement.icon, { className: 'h-6 w-6' })}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{achievement.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {currentLevel ? `Nível: ${currentLevel.name}` : 'Bloqueado'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                             <div className="mt-4">
                                {isMaxLevel ? (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-yellow-500">
                                        {ICONS.trophyGold}
                                        <span>Nível Máximo!</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500 dark:text-gray-400">Progresso</span>
                                            {nextLevel && (
                                                <span className="font-semibold text-gray-600 dark:text-gray-300">
                                                   {progressPercentage.toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                            <div 
                                                className="bg-brand-green h-1.5 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progressPercentage}%`}}
                                            ></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

export default Achievements;