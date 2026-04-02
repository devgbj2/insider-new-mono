import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

export default function MarketDescription() {
  return (
    <Card>
      <CardHeader >
        <CardTitle className="text-center font-extrabold text-3xl tracking-tight">Market Description</CardTitle>

      </CardHeader>
      <CardContent className="space-y-4 sm:px-28 px-6">
        <p className="text-muted-foreground text-center">
          - Belum ada konten - 
        </p>

      </CardContent>

    </Card>
  );
}
