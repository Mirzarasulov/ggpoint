import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { Container } from "./Container";

export function PlaceholderPage({
  title,
  description,
  backHref = "/",
  backLabel = "На главную",
}: {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl gradient-bg">
          <Construction className="h-7 w-7 text-white" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-3 text-muted">{description}</p>
        <Link
          href={backHref}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface/40 px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
    </Container>
  );
}
