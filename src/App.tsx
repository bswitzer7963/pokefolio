import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { TransitionProvider } from './components/Transition';
import Title from './screens/Title';
import Battle from './battle/Battle';
import ProjectPage from './screens/ProjectPage';
import StaticPortfolio from './screens/StaticPortfolio';
import AnimationLab from './screens/AnimationLab';

// Keyed on location so "battle again" starts a fresh battle.
function BattleRoute() {
  const loc = useLocation();
  return <Battle key={loc.key} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Routes>
          <Route path="/" element={<Title />} />
          <Route path="/battle" element={<BattleRoute />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/portfolio" element={<StaticPortfolio />} />
          <Route path="/animations" element={<AnimationLab />} />
          <Route path="*" element={<Title />} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  );
}
