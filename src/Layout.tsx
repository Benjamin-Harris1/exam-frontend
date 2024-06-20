import { Header } from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};
export default function Layout({ children }: LayoutProps) {
  return (
    <main className="w-full min-h-screen bg-background text-text">
      <div className="mx-auto container min-w-[350px] px-2 lg:px-0 lg:max-w-[1440px] justify-center items-center pb-10">
        <Header />
        {children}
      </div>
    </main>
  );
}
