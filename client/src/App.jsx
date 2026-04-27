import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard    from './pages/Dashboard';
import DailyRoutine from './pages/DailyRoutine';
import WeeklyCheck  from './pages/WeeklyCheck';
import StudyLog     from './pages/StudyLog';
import Strategy     from './pages/Strategy';
import RecoveryPlan from './pages/RecoveryPlan';
import Timeline     from './pages/Timeline';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 px-5 py-7 max-w-6xl mx-auto w-full pb-16">
          <Routes>
            <Route path="/"          element={<Dashboard />}    />
            <Route path="/daily"     element={<DailyRoutine />} />
            <Route path="/weekly"    element={<WeeklyCheck />}  />
            <Route path="/log"       element={<StudyLog />}     />
            <Route path="/strategy"  element={<Strategy />}     />
            <Route path="/recovery"  element={<RecoveryPlan />} />
            <Route path="/timeline"  element={<Timeline />}     />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
