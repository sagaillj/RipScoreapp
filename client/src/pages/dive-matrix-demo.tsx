import { DiveProgressMatrix } from "@/components/dive/DiveProgressMatrix";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function DiveMatrixDemoPage() {
  return (
    <PageWrapper>
      <div className="container py-6 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">Your Dive Collection</h1>
        <p className="text-muted-foreground mb-6">
          Collect, unlock, and master all the dives in your program. Click on empty position badges to simulate unlocking dives!
        </p>
        
        <div className="flex flex-col space-y-6">
          <DiveProgressMatrix />
        </div>
      </div>
    </PageWrapper>
  );
}