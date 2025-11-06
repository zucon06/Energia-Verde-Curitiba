import React from 'react';
import Card from '../ui/Card';
import { CommunityGoal } from '../../types';
import { useAnimateOnScroll } from '../../hooks/useAnimateOnScroll';
import { useCountUp } from '../../hooks/useCountUp';

interface CommunityGoalCardProps {
    goal: CommunityGoal;
}

const CommunityGoalCard: React.FC<CommunityGoalCardProps> = ({ goal }) => {
    const [ref, isVisible] = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.3, triggerOnce: true });
    const progressPercentage = (goal.currentValue / goal.goalValue) * 100;
    const animatedCurrentValue = useCountUp(isVisible ? goal.currentValue : 0, 1500);

    return (
        <Card ref={ref}>
            <div className="flex items-center mb-3">
                <span className="text-brand-green">{React.cloneElement(goal.icon, { className: 'h-6 w-6' })}</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">{goal.title}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{goal.description}</p>
            
            <div>
                <div className="flex justify-between items-baseline text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Progresso</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {animatedCurrentValue.toLocaleString('pt-BR', {maximumFractionDigits: 0})} / {goal.goalValue.toLocaleString('pt-BR')} {goal.unit}
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                        className="bg-brand-green h-2.5 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: isVisible ? `${progressPercentage}%` : '0%' }}>
                    </div>
                </div>
                 <p className="text-xs text-center mt-3 text-gray-400 dark:text-gray-500">
                    Ao atingir a meta, todos os investidores ativos ganham uma conquista exclusiva!
                </p>
            </div>
        </Card>
    );
};

export default CommunityGoalCard;