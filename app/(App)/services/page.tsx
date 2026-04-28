import { Suspense } from "react";
import ServicesView from "./ServicesView";

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B72D2D]"></div>
        </div>
      }
    >
      <ServicesView />
    </Suspense>
  );
}
