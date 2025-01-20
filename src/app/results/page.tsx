'use client';

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function ResultsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Competition Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Results feature coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}