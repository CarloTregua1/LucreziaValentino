import { Nav } from "@/components/shared/nav";
import { Footer } from "@/components/shared/footer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
