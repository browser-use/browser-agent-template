"use client";

import type { EveInteractionPart, EveMessage, EveMessagePart, EveToolPart } from "eve/react";
import { signInEnding } from "eve/react";
import { type FormEvent, useState } from "react";
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
import { Input } from "@/components/ui/input";

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
  if (!interaction) {
    return null;
  }

  if (interaction.request.kind === "sign-in") {
    return <SignInPrompt interaction={interaction} />;
  }

  const selectedOption = interaction.request.options?.find(
    (option) => option.id === interaction.answer?.optionId,
  );
  const open = interaction.status === "open";
  const options = interaction.request.options ?? [];
  const acceptsFreeform = interaction.request.allowFreeform === true || options.length === 0;

  return (
    <div className="space-y-3 rounded-md border border-yellow-500/30 bg-yellow-500/5 p-3">
      <p className="text-muted-foreground text-sm">{interaction.request.prompt}</p>
      {interaction.answer ? (
        <p className="font-medium text-sm">
          {open ? "Response submitted: " : "Responded: "}
          {selectedOption?.label ?? interaction.answer.text ?? interaction.answer.optionId}
        </p>
      ) : null}
      {open ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
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
          {acceptsFreeform ? (
            <FreeTextAnswer
              canRespond={canRespond}
              interactionId={interaction.interactionId}
              onAnswers={onAnswers}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function FreeTextAnswer({
  canRespond,
  interactionId,
  onAnswers,
}: {
  readonly canRespond: boolean;
  readonly interactionId: string;
  readonly onAnswers: (answers: readonly AgentAnswer[]) => void | Promise<void>;
}) {
  const [text, setText] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const answer = text.trim();
    if (!answer || !canRespond) return;
    void onAnswers([{ interactionId, text: answer }]);
  };

  return (
    <form className="flex w-full gap-2" onSubmit={submit}>
      <Input
        aria-label="Answer"
        disabled={!canRespond}
        onChange={(event) => setText(event.currentTarget.value)}
        placeholder="Type your answer…"
        value={text}
      />
      <Button disabled={!canRespond || text.trim().length === 0} size="sm" type="submit">
        Answer
      </Button>
    </form>
  );
}

function SignInPrompt({
  interaction,
}: {
  readonly interaction: EveInteractionPart | NonNullable<EveToolPart["interaction"]>;
}) {
  const signIn = interaction.request.signIn;
  const name = signIn?.displayName ?? signIn?.name ?? "the service";
  const settled = interaction.status === "settled";

  return (
    <div className="space-y-3 rounded-md border border-blue-500/30 bg-blue-500/5 p-3">
      <p className="font-medium text-sm">
        {settled ? `${name} authorization ${signInEnding(interaction.outcome ?? "withdrawn")}` : `Connect ${name}`}
      </p>
      <p className="text-muted-foreground text-sm">
        {settled ? interaction.reason ?? "The sign-in request has finished." : signIn?.instructions ?? interaction.request.prompt}
      </p>
      {!settled && signIn?.userCode ? (
        <p className="text-sm">
          Code: <code className="rounded bg-background px-1 py-0.5">{signIn.userCode}</code>
        </p>
      ) : null}
      {!settled && signIn?.url ? (
        <Button asChild size="sm">
          <a href={signIn.url} rel="noreferrer" target="_blank">
            Sign in with {name}
          </a>
        </Button>
      ) : null}
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
