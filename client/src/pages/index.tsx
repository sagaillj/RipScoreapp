import { PageWrapper } from "@/components/layout/PageWrapper";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { FeatureSections } from "@/components/home/FeatureSections";
import { PricingTeaser } from "@/components/home/PricingTeaser";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>RipScore.app - The All-in-One Diving Platform</title>
        <meta name="description" content="RipScore streamlines dive meet management, real-time judging, team coordination, and performance analytics in one all-in-one diving platform." />
      </Helmet>
      
      <PageWrapper className="pt-0">
        <HeroSection />
        <FeatureGrid />
        <FeatureSections />
        <PricingTeaser />
      </PageWrapper>
    </>
  );
}
