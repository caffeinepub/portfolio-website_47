import HeroSection from '../components/HeroSection';
import IntroductionDisplay from '../components/IntroductionDisplay';
import AchievementsSection from '../components/AchievementsSection';
import CustomSectionsDisplay from '../components/CustomSectionsDisplay';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <IntroductionDisplay />
      <AchievementsSection />
      <CustomSectionsDisplay />
    </div>
  );
}
