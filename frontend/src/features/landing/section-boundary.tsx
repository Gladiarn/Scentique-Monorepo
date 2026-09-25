"use client";

import { useRouter } from "next/navigation";
import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

function SectionError({ label, onRetry }: { label: string; onRetry: () => void }) {
  const router = useRouter();
  return (
    <section className="py-24">
      <Container>
        <div role="alert" className="rounded-xl border border-line bg-surface p-8">
          <h2 className="font-display text-2xl">We could not load {label}</h2>
          <p className="mt-2 max-w-md text-muted">Something went wrong on our side. The rest of the page still works. Try again in a moment.</p>
          <Button
            className="mt-6"
            onClick={() => {
              router.refresh(); // re-runs the server data fetch
              onRetry();
            }}
          >
            Try again
          </Button>
        </div>
      </Container>
    </section>
  );
}

/** Contains a failing data section so one bad request does not take down the whole page. */
export class SectionBoundary extends Component<{ label: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <SectionError label={this.props.label} onRetry={() => this.setState({ failed: false })} />;
    return this.props.children;
  }
}
