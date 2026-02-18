import React from 'react';
import { Check } from 'lucide-react';
import { QuoteStep } from '../types/quotation';

interface Step {
  key: QuoteStep;
  label: string;
}

const STEPS: Step[] = [
  { key: 'search', label: 'Search' },
  { key: 'results', label: 'Schedules' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'quote', label: 'Quotation' },
  { key: 'book', label: 'Book' },
  { key: 'confirmed', label: 'Confirmed' },
];

const STEP_ORDER = STEPS.map(s => s.key);

interface StepIndicatorProps {
  currentStep: QuoteStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center py-6 px-4">
      <div className="flex items-center space-x-0">
        {STEPS.map((step, index) => {
          const stepIndex = STEP_ORDER.indexOf(step.key);
          const isCompleted = stepIndex < currentIndex;
          const isActive = stepIndex === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                      : isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-200 ring-4 ring-sky-100'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : <span>{index + 1}</span>}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                    isCompleted ? 'text-emerald-600' : isActive ? 'text-sky-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`w-12 sm:w-16 h-0.5 mb-5 transition-all duration-300 ${
                    stepIndex < currentIndex ? 'bg-emerald-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
