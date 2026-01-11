import { Header } from "./Header";
import { Footer } from "./Footer";
import { RightRail } from "./RightRail";
import { Outlet } from "react-router";
import { createContext, useContext } from "react";
import { useAppSelector } from "../store/hooks";
import type { User } from "../types";

interface LayoutContextType {
  user: User | null;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useUser must be used within Layout");
  }
  return context;
};

interface LayoutProps {
  showRightRail?: boolean;
}

export const Layout = ({ showRightRail = true }: LayoutProps) => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <LayoutContext.Provider value={{ user }}>
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        <Header user={user} />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Outlet />
            </div>
            {showRightRail && (
              <aside className="hidden lg:block">
                <RightRail user={user} />
              </aside>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </LayoutContext.Provider>
  );
};

