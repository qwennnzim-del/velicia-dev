
import React, { useState, useEffect,  } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';

export interface OnboardingStep {
  targetId?: string; // If null, show centered modal
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingProps {
  steps: OnboardingStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ steps, isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const updateRect = () => {
      const step = steps[currentStep];
      if (step.targetId) {
        const element = document.getElementById(step.targetId);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
    };

    // Initial calculation
    updateRect();

    // Recalculate on resize
    window.addEventListener('resize', updateRect);
    // Recalculate after a short delay to allow UI to settle
    const timer = setTimeout(updateRect, 300);

    return () => {
      window.removeEventListener('resize', updateRect);
      clearTimeout(timer);
    };
  }, [currentStep, isOpen, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  // Calculate Tooltip Position based on Target Rect
  const getTooltipStyle = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const gap = 20; // Space between spotlight and tooltip
    let top = 0;
    let left = 0;
    let transform = '';

    // Default to 'top' if position not specified, unless close to top edge
    let position = step.position || 'top';
    if (targetRect.top < 200 && position === 'top') position = 'bottom';

    switch (position) {
      case 'top':
        top = targetRect.top - gap;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translate(-50%, 0)';
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - gap;
        transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + gap;
        transform = 'translate(0, -50%)';
        break;
    }

    // Boundary checks (simplified) to prevent going off screen
    // In a real prod app, would use logic to flip if out of bounds.
    
    return { top, left, transform, position: 'absolute' as const };
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop with a "cutout" effect simulated by opacity */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-500" />

      {/* Spotlight Box */}
      {targetRect && (
        <div 
            className="absolute border-2 border-white/50 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-500 ease-in-out pointer-events-none z-[101]"
            style={{
                top: targetRect.top - 4,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
                boxShadow: '0 0 0 4px rgba(121, 40, 202, 0.5), 0 0 0 9999px rgba(0,0,0,0.7)'
            }}
        >
            <div className="absolute inset-0 rounded-xl animate-pulse bg-purple-500/10"></div>
        </div>
      )}

      {/* Tooltip Card */}
      <div 
        className="absolute z-[102] w-[320px] max-w-[90vw] transition-all duration-500 ease-in-out"
        style={getTooltipStyle()}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-white/20 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

             <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold tracking-widest text-[#7928CA] uppercase bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                        Tutorial {currentStep + 1}/{steps.length}
                    </span>
                    <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
                    {step.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        {steps.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-[#7928CA]' : 'w-1.5 bg-gray-200'}`} 
                            />
                        ))}
                    </div>
                    
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-all shadow-lg active:scale-95 group"
                    >
                        {isLastStep ? 'Selesai' : 'Lanjut'}
                        {isLastStep ? <Check size={16} /> : <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                    </button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
