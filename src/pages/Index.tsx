import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TrustIndicators from "@/components/home/TrustIndicators";
import CoursesPreview from "@/components/home/CoursesPreview";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HowItWorks from "@/components/home/HowItWorks";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustIndicators />
      <CoursesPreview />
      <StatsSection />
      <TestimonialsSection />
      <HowItWorks />
    </Layout>
  );
};

export default Index;
