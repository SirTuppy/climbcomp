import { AuthCard } from "../../components/auth/AuthCard";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthCard />
      </div>
    </div>
  );
}