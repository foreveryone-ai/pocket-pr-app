"use client";
import { Skeleton } from "@nextui-org/react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

export default function Loading() {
  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center text-black justify-start xl:px-20 pt-20 pb-10 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-12 gap-12 sm:px-4 md:px-8 lg:px-10 xl:px-20 2xl:px-32">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="py-4 bg-green-800">
            <CardHeader className="pb-0 pt-2 px-4 flex-col w-64 items-start">
              <p className="text-tiny text-white font-bold">YouTube</p>
              <h4 className="font-bold text-white text-large">Loading...</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Skeleton className="rounded-xl">
                <div className="h-48 rounded-xl bg-default-300"></div>
              </Skeleton>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
