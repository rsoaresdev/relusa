"use client";

import { ProtectedRoute } from "@/components/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { useAuth } from "@/components/auth";

export default function AdminPage() {
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="pt-24 pb-16">
        {/* Header */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
                Painel de <span className="text-primary">Administração</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Faça a gestão de marcações, clientes e estatísticas
              </p>
            </div>
          </div>
        </section>

        {/* Admin Panel */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <AdminDashboard 
                  session={{ user }} 
                  onLogout={signOut} 
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
