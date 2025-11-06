
import React from 'react';

interface ImpactAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * This component is intentionally left empty to remove all AI-related functionality
 * from the application, as requested, to resolve loading issues.
 */
const ImpactAdvisor: React.FC<ImpactAdvisorProps> = () => {
  return null;
};

export default ImpactAdvisor;