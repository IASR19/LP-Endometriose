"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChatBubble } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { ChoiceButtons } from "@/components/chat/choice-buttons";
import { EbookFinalScreen } from "@/components/final/ebook-final-screen";
import {
  getStepById,
  initialAnswers,
  resolveMessages,
  resolveNextStep,
  type LeadAnswers,
} from "@/content/chat-flow";
import { formatBrazilianPhone } from "@/lib/form/formatters";

type VisibleMessage = {
  id: string;
  text: string;
  from: "bot" | "user";
};

const MESSAGE_STAGGER_MS = 1100;
const AUTO_ADVANCE_MS = 1600;
const FIRST_MESSAGE_DELAY_MS = 500;

export function LeadChat() {
  const [answers, setAnswers] = useState<LeadAnswers>(initialAnswers);
  const [stepId, setStepId] = useState("intro");
  const [messages, setMessages] = useState<VisibleMessage[]>([]);
  const [revealing, setRevealing] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);
  const messageSeqRef = useRef(0);
  const revealedStepsRef = useRef(new Set<string>());
  const answersRef = useRef(answers);

  const step = getStepById(stepId);

  const nextMessageId = useCallback(() => {
    messageSeqRef.current += 1;
    return `msg-${messageSeqRef.current}`;
  }, []);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, revealing, error, scrollToBottom]);

  const beginStep = useCallback((nextStepId: string) => {
    setError(null);
    setInputValue("");
    setRevealing(true);
    setStepId(nextStepId);
  }, []);

  useEffect(() => {
    if (!step || finished) return;

    // Evita re-revelar o mesmo passo (Strict Mode remonta o effect)
    if (revealedStepsRef.current.has(step.id)) {
      const inputVisible = window.setTimeout(() => setRevealing(false), 0);
      return () => window.clearTimeout(inputVisible);
    }

    const runId = ++runIdRef.current;
    const currentAnswers = answersRef.current;
    const botMessages = resolveMessages(step, currentAnswers);
    const addedIds: string[] = [];

    let cancelled = false;
    let stepCompleted = false;
    let index = 0;
    const timeouts: number[] = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timeouts.push(id);
    };

    const tick = () => {
      if (cancelled || runId !== runIdRef.current) return;

      if (index >= botMessages.length) {
        stepCompleted = true;
        revealedStepsRef.current.add(step.id);
        setRevealing(false);

        if (step.autoAdvance) {
          schedule(() => {
            if (cancelled || runId !== runIdRef.current) return;
            const next = resolveNextStep(step, answersRef.current);
            if (next) {
              beginStep(next);
            } else {
              setFinished(true);
            }
          }, AUTO_ADVANCE_MS);
        }
        return;
      }

      const text = botMessages[index];
      const id = nextMessageId();
      addedIds.push(id);
      index += 1;

      setMessages((prev) => [...prev, { id, text, from: "bot" }]);
      schedule(tick, MESSAGE_STAGGER_MS);
    };

    schedule(tick, FIRST_MESSAGE_DELAY_MS);

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
      // Só remove balões se o passo não chegou a completar (ex.: remount Strict Mode)
      if (!stepCompleted && addedIds.length > 0) {
        const abortIds = new Set(addedIds);
        setMessages((prev) =>
          prev.filter((message) => !abortIds.has(message.id)),
        );
      }
    };
  }, [step, finished, beginStep, nextMessageId]);

  function advanceWithAnswer(field: keyof LeadAnswers, rawValue: string) {
    if (!step?.input || revealing) return;

    const transformed = step.input.transform
      ? step.input.transform(rawValue)
      : rawValue.trim();

    const validationError = step.input.validate?.(transformed) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }

    const nextAnswers = { ...answers, [field]: transformed };
    setAnswers(nextAnswers);

    const id = nextMessageId();
    setMessages((prev) => [
      ...prev,
      {
        id,
        text: transformed,
        from: "user",
      },
    ]);

    const next = resolveNextStep(step, nextAnswers);
    if (next) {
      beginStep(next);
    } else {
      setFinished(true);
    }
  }

  function handleTextSubmit() {
    if (!step?.input) return;
    advanceWithAnswer(step.input.field, inputValue);
  }

  function handleChoice(value: string) {
    if (!step?.input) return;
    advanceWithAnswer(step.input.field, value);
  }

  if (finished) {
    return <EbookFinalScreen />;
  }

  const showInput =
    !revealing &&
    step?.input &&
    step.input.kind !== "choice" &&
    !step.autoAdvance;

  const showChoices =
    !revealing && step?.input?.kind === "choice" && step.input.choices;

  const inputMode =
    step?.input?.kind === "email"
      ? "email"
      : step?.input?.kind === "phone"
        ? "tel"
        : "text";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#f3f3f3]">
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-6 pt-8"
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            text={message.text}
            from={message.from}
          />
        ))}

        {showInput && step.input ? (
          <ChatInput
            value={inputValue}
            placeholder={step.input.placeholder ?? ""}
            inputMode={inputMode}
            error={error}
            onChange={(value) => {
              setInputValue(
                step.input?.kind === "phone"
                  ? formatBrazilianPhone(value)
                  : value,
              );
              if (error) setError(null);
            }}
            onSubmit={handleTextSubmit}
          />
        ) : null}

        {showChoices && step.input?.choices ? (
          <ChoiceButtons
            choices={step.input.choices}
            onSelect={handleChoice}
          />
        ) : null}
      </div>
    </div>
  );
}
