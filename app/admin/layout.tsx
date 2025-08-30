import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar or Sidebar can go here */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default AdminLayout;
