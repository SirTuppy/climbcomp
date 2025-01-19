"use client";

import { useAuthContext } from '../providers/AuthProvider';
import { Button } from '../ui/button';
import Link from 'next/link';

export function Navbar() {
  const { user, signOut } = useAuthContext();

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          ClimbComp
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span>{user.email}</span>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}