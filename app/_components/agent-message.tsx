"use client";

import type { EveInteractionPart, EveMessage, EveMessagePart, EveToolPart } from "eve/react";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Button } from "@/components/ui/button";

export type AgentAnswer = {
  readonly optionId?: string;
  readonly interactionId: string;
  readonly text?: string;
};

export function AgentMessage({
  canRespond,
  isStreaming,
  message,
  onAnswers,
}: {
  readonly canRespond: boolean;
  readonly isStreaming: boolean;
  readonly message: EveMessage;
  readonly onAnswers: (answers: readonly AgentAnswer[]) => void | Promise<void>;
}) {
  const lastTextIndex = message.parts.reduce(
    (last, part, index) => (part.type === "text" ? index : last),
    -1,
  );

  return (
    <Message
      data-optimistic={message.metadata?.optimistic ? "true" : undefined}
      from={message.role}
    >
      <MessageContent>
        {message.parts.map((part, index) => (
          <AgentMessagePart
            canRespond={canRespond}
            key={partKey(part, index)}
            onAnswers={onAnswers}
            part={part}
            showCaret={isStreaming && message.role === "assistant" && index === lastTextIndex}
          />
        ))}
      </MessageContent>
    </Message>
  );
}

function AgentMessagePart({
  canRespond,
  onAnswers,
  part,
  showCaret,
}: {
  readonly canRespond: boolean;
  readonly onAnswers: (answers: readonly AgentAnswer[]) => void | Promise<void>;
  readonly part: EveMessagePart;
  readonly showCaret: boolean;
}) {
  switch (part.type) {
    case "text":
      return (
        <MessageResponse caret="block" isAnimating={showCaret}>
          {part.text}
        </MessageResponse>
      );
    case "reasoning":
      return (
        <Reasoning defaultOpen isStreaming={part.state === "streaming"}>
          <ReasoningTrigger />
          <ReasoningContent>{part.text}</ReasoningContent>
        </Reasoning>
      );
    case "tool":
      return (
        <Tool defaultOpen={part.state === "approval" || part.state === "blocked"}>
          <ToolHeader
            state={part.state}
            title={part.label}
            toolName={part.name}
            type="tool"
          />
          <ToolContent>
            {part.input === undefined ? null : <ToolInput input={part.input} />}
            <InteractionActions
              canRespond={canRespond}
              part={part}
              onAnswers={onAnswers}
            />
            <ToolOutput errorText={part.error?.message} output={part.output} />
          </ToolContent>
        </Tool>
      );
    case "interaction":
      return <InteractionActions canRespond={canRespond} part={part} onAnswers={onAnswers} />;
  }
}

function InteractionActions({
  canRespond,
  onAnswers,
  part,
}: {
  readonly canRespond: boolean;
  readonly onAnswers: (answers: readonly AgentAnswer[]) => void | Promise<void>;
  readonly part: EveToolPart | EveInteractionPart;
}) {
  const interaction = part.type === "tool" ? part.interaction : part;
  if (!interaction || interaction.request.kind === "sign-in") {
    return null;
  }

  const selectedOption = interaction.request.options?.find(
    (option) => option.id === interaction.answer?.optionId,
  );

  return (
    <div className="space-y-3 rounded-md border border-yellow-500/30 bg-yellow-500/5 p-3">
      <p className="text-muted-foreground text-sm">{interaction.request.prompt}</p>
      {interaction.answer ? (
        <p className="font-medium text-sm">
          Responded: {selectedOption?.label ?? interaction.answer.text ?? interaction.answer.optionId}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {interaction.request.options?.map((option) => (
            <Button
              disabled={!canRespond}
              key={option.id}
              onClick={() => {
                void onAnswers([
                  {
                    optionId: option.id,
                    interactionId: interaction.interactionId,
                  },
                ]);
              }}
              size="sm"
              type="button"
              variant={option.style === "danger" ? "destructive" : "default"}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function partKey(part: EveMessagePart, index: number): string {
  switch (part.type) {
    case "tool":
      return part.callId;
    case "interaction":
      return part.interactionId;
    default:
      return `${part.type}:${index}`;
  }
}
