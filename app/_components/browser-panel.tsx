"use client";

/** A live view of the agent's cloud browser — just an iframe of the liveUrl. */
export function BrowserPanel({ liveUrl }: { readonly liveUrl: string }) {
  return (
    <aside className="flex h-dvh w-1/2 shrink-0 flex-col border-border border-l bg-muted/20">
      <div className="flex h-14 shrink-0 items-center px-4 text-muted-foreground text-sm">
        Agent&apos;s browser
      </div>
      <iframe
        allow="clipboard-read; clipboard-write"
        className="flex-1 border-0"
        src={liveUrl}
        title="Agent's browser"
      />
    </aside>
  );
}
