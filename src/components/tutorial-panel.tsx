"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildTutorialSteps } from "@/lib/tutorial-parser";
import { useLanguage } from "@/components/language-provider";

interface TutorialPanelProps {
  code: string;
  description: string;
}

export function TutorialPanel({ code, description }: TutorialPanelProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(
    () => buildTutorialSteps(code, description),
    [code, description]
  );

  // Reset step when snippet changes
  useEffect(() => {
    setCurrentStep(0);
  }, [code, description]);

  const totalSteps = steps.length;
  const step = steps[currentStep];
  const codeLines = useMemo(() => code.split("\n"), [code]);

  const handlePrev = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(totalSteps - 1, s + 1));
  }, [totalSteps]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Only handle when not in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePrev, handleNext]);

  if (totalSteps === 0) {
    return null;
  }

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {t("tutorial.title")}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {t("tutorial.stepOf")
              .replace("{current}", String(currentStep + 1))
              .replace("{total}", String(totalSteps))}
          </span>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-1.5 px-0.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all cursor-pointer",
                  i === currentStep
                    ? "bg-blue-500 scale-125"
                    : i < currentStep
                      ? "bg-blue-300 dark:bg-blue-700"
                      : "bg-slate-200 dark:bg-slate-700"
                )}
                title={`Step ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Code view with line highlighting */}
        <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="bg-slate-900 dark:bg-slate-950 overflow-x-auto">
            <pre className="text-xs leading-5 py-3">
              {codeLines.map((line, i) => {
                const lineNum = i + 1;
                const isHighlighted =
                  step && lineNum >= step.lineStart && lineNum <= step.lineEnd;
                // Lines before current step's range (already explained)
                const isPast = step && lineNum < step.lineStart && currentStep > 0;

                return (
                  <div
                    key={i}
                    className={cn(
                      "flex transition-all duration-200",
                      isHighlighted
                        ? "bg-blue-500/20 border-l-2 border-blue-400"
                        : isPast
                          ? "opacity-50 border-l-2 border-transparent"
                          : "opacity-30 border-l-2 border-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "select-none text-right pr-3 pl-3 min-w-[40px] font-mono",
                        isHighlighted
                          ? "text-blue-400"
                          : "text-slate-600"
                      )}
                    >
                      {lineNum}
                    </span>
                    <code
                      className={cn(
                        "pr-4 font-mono whitespace-pre",
                        isHighlighted
                          ? "text-slate-100"
                          : "text-slate-500"
                      )}
                    >
                      {line || " "}
                    </code>
                  </div>
                );
              })}
            </pre>
          </div>
        </div>

        {/* Step description */}
        <div className="mx-4 mb-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
              {currentStep + 1}
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {step?.description}
            </p>
          </div>
          {step && (
            <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 pl-7">
              {t("tutorial.lineRange")
                .replace("{start}", String(step.lineStart))
                .replace("{end}", String(step.lineEnd))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-xs h-8"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            {t("tutorial.prev")}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(0)}
            className="text-xs h-8 text-slate-400"
            title={t("tutorial.restart")}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>

          <Button
            variant={currentStep === totalSteps - 1 ? "ghost" : "default"}
            size="sm"
            onClick={handleNext}
            disabled={currentStep === totalSteps - 1}
            className="text-xs h-8"
          >
            {t("tutorial.next")}
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        {/* Keyboard hint */}
        <div className="text-center pb-3 text-[10px] text-slate-400 dark:text-slate-600">
          {t("tutorial.keyHint")}
        </div>
      </CardContent>
    </Card>
  );
}
