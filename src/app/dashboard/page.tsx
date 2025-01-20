'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/providers/AuthProvider'
import { Button } from '../../components/ui/button'
import { AuthDebug } from '../../components/shared/AuthDebug'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Trophy, Users, Award, Settings, BarChart } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.roles?.includes('admin');

  const navigationCards = [
    {
      title: 'Competitions',
      description: 'Manage and view climbing competitions',
      icon: Trophy,
      href: '/competitions',
      adminOnly: false,
    },
    {
      title: 'Participants',
      description: 'Manage competition participants',
      icon: Users,
      href: '/participants',
      adminOnly: true,
    },
    {
      title: 'Results',
      description: 'View competition results and rankings',
      icon: Award,
      href: '/results',
      adminOnly: false,
    },
    {
      title: 'Statistics',
      description: 'Competition analytics and insights',
      icon: BarChart,
      href: '/statistics',
      adminOnly: true,
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      href: '/settings',
      adminOnly: true,
    },
  ];

  // Filter cards based on user role
  const visibleCards = navigationCards.filter(card => !card.adminOnly || isAdmin);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Welcome to ClimbComp</h1>
        <p className="text-gray-600">
          {isAdmin 
            ? 'Manage your climbing competitions and view insights.'
            : 'View and participate in climbing competitions.'}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((card) => (
          <Card 
            key={card.href}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(card.href)}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="w-8 h-8 mr-4 bg-primary/5 rounded-lg flex items-center justify-center">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{card.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Keep the AuthDebug component for development */}
      <section className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <AuthDebug />
      </section>
    </div>
  );
}