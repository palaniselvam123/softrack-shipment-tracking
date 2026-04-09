import React from 'react';
import { Check } from 'lucide-react';
import { steps } from './bookingData';

interface StepProgressBarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, onStepClick }) => (
  <div className="relative mb-10">
    <div className="hidden sm:block absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
    <div
      className="hidden sm:block absolute top-5 left-0 h-0.5 bg-sky-500 transition-all duration-500"
      style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
    />
    <div className="flex items-start justify-between relative">
      {steps.map((step) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className="flex flex-col items-center group relative z-10"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                isCompleted
                  ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-200'
                  : isCurrent
                  ? 'bg-white border-sky-500 text-sky-600 shadow-lg shadow-sky-100 ring-4 ring-sky-50'
                  : 'bg-white border-gray-200 text-gray-400 group-hover:border-gray-300'
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <span
              className={`mt-2 text-xs font-semibold transition-colors hidden sm:block ${
                isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {step.title}
            </span>
            <span className="text-[10px] text-gray-400 hidden lg:block">{step.description}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default StepProgressBar;
