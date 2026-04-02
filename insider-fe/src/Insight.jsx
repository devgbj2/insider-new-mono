import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

export default function Insight() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-extrabold text-3xl tracking-tight">
          Insight insider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:px-28 px-6">
        <div className="mx-auto w-full">
          <div className="relative aspect-[16/10] w-full">
            <img
              src="/insight-1.webp"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div className="mx-auto w-full">
          <div className="relative aspect-[16/10] w-full">
            <img
              src="/insight-2.webp"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div className="mx-auto w-full">
          <div className="relative aspect-[16/10] w-full">
            <img
              src="/insight-3.webp"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
