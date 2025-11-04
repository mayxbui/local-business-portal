import SliderImg from '../slider/slider';
import { useUser } from '../contexts/user-context.js';
import LocalsSlider from "./local-slider.js";
import DealsSlider from "./deal-slider.js";

function Home() {
  const { userDetails, loading } = useUser();

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ marginBottom: '20px' }}>
      <SliderImg />
      <DealsSlider/>
      <LocalsSlider />
    </div>
  );
}

export default Home;