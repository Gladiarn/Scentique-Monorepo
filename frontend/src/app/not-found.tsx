import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";

export default function NotFound() {
  return (
    <Container>
      <PageTitle lead="That page does not exist.">Not found</PageTitle>
      <Link href="/" className="text-accent underline-offset-4 hover:underline">
        Back to the home page
      </Link>
    </Container>
  );
}
