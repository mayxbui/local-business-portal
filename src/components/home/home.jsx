import SliderImg from '../slider/slider.jsx';
import { useUser } from '../contexts/user-context.jsx';
import LocalsSlider from "./local-slider.jsx";
import DealsSlider from "./deal-slider.jsx";

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