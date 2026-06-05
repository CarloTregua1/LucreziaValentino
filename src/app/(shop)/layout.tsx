import { Nav } from "@/components/shared/nav";
import { Footer } from "@/components/shared/footer";
import { SmoothScroll } from "./_components/smooth-scroll";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fixed atmospheric backdrop — a soft cream gradient with two faint
          ambient glows. The page's transparent sections scroll over it so the
          whole layout reads as one continuous, stitched-together surface; the
          cream-deep and navy sections stay opaque as punctuating anchors. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)] via-[var(--color-background)] to-[var(--color-cream-deep)]" />
        <div className="absolute -top-[18vh] left-1/2 h-[70vh] w-[85vw] -translate-x-1/2 rounded-full bg-[var(--color-foreground)]/5 blur-[140px]" />
        <div className="absolute -bottom-[12vh] -right-[12vw] h-[60vh] w-[55vw] rounded-full bg-[var(--color-accent)]/8 blur-[140px]" />
      </div>

      <SmoothScroll />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
