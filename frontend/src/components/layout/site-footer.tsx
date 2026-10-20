import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer>
      <Container className="py-12 text-sm text-muted">
        <p>{siteConfig.tagline}</p>
        <p className="mt-2">© {new Date().getFullYear()} {siteConfig.name}. Draft site with placeholder content.</p>
      </Container>
    </footer>
  );
}
