"use client";
import dynamic from "next/dynamic";

const BasicMap = dynamic(() => import("@/src/app/components/BasicMap"), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <BasicMap />
      hello
    </div>
  );
}
