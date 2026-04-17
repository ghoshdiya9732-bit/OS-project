import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Play, Download, Moon, Sun, BarChart3, Settings, Home, User, Keyboard, Zap } from 'lucide-react';
import ProcessInput from './components/ProcessInput';
import GanttChart from './components/GanttChart';
import PerformanceMetrics from './components/PerformanceMetrics';
import AlgorithmSelector from './components/AlgorithmSelector';
import TypingTutor from './components/TypingTutor';
import TypingGame from './components/TypingGame';
import TypingAnimation from './components/TypingAnimation';
import { schedulingAlgorithms } from './utils/schedulingAlgorithms';
import './App.css';

function App() {
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [ganttData, setGanttData] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [typingMode, setTypingMode] = useState('tutor'); // 'tutor' or 'game'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const runSimulation = () => {
    try {
      setLoading(true);
      setError(null);
      
      if (processes.length === 0) {
        setError('Please add at least one process before running simulation');
        setLoading(false);
        return;
      }
      
      const algorithm = schedulingAlgorithms[selectedAlgorithm];
      if (!algorithm) {
        throw new Error('Invalid algorithm selected');
      }
      
      const result = algorithm(processes, timeQuantum);
      
      if (!result || !result.ganttChart || !result.metrics) {
        throw new Error('Algorithm returned invalid result');
      }
      
      setGanttData(result.ganttChart);
      setPerformanceData(result.metrics);
      
      if (stepMode) {
        setIsAnimating(true);
        animateSteps(result.ganttChart);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred during simulation');
      setLoading(false);
    }
  };

  const animateSteps = (ganttChart) => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= ganttChart.length) {
        clearInterval(interval);
        setIsAnimating(false);
        return;
      }
      setCurrentStep(step);
      step++;
    }, 1000);
  };

  const exportResults = () => {
    try {
      if (!performanceData || ganttData.length === 0) {
        setError('No simulation results to export');
        return;
      }
      
      const results = {
        algorithm: selectedAlgorithm,
        timeQuantum: selectedAlgorithm === 'roundRobin' ? timeQuantum : null,
        processes: processes,
        ganttChart: ganttData,
        performanceMetrics: performanceData
      };
      
      const dataStr = JSON.stringify(results, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `cpu-scheduling-results-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setError(null);
    } catch (err) {
      setError('Failed to export results: ' + err.message);
    }
  };

  const renderMobileView = () => (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="pb-20">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">CPU Scheduler</h1>
            </div>
            <div className="flex items-center space-x-2">
              <TypingAnimation 
                texts={["System Online", "Ready", "Processing"]} 
                speed={150}
                cursorType="blink"
                className="text-xs text-gray-600 dark:text-gray-400 mr-2"
              />
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
              <button
                onClick={() => setError(null)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                ×
              </button>
            </div>
          )}
          {currentView === 'home' && (
            <>
              <div className="basic-card p-4 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="basic-title mb-4 dark:text-white">Algorithm Control</h3>
                <AlgorithmSelector
                  selectedAlgorithm={selectedAlgorithm}
                  setSelectedAlgorithm={setSelectedAlgorithm}
                  timeQuantum={timeQuantum}
                  setTimeQuantum={setTimeQuantum}
                />
              </div>
              
              <div className="basic-card p-4 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="basic-text font-bold mb-3 dark:text-white">Process Input</h3>
                <ProcessInput
                  processes={processes}
                  setProcesses={setProcesses}
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={runSimulation}
                  disabled={processes.length === 0}
                  className="flex-1 basic-button px-4 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center space-x-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <Play className="w-4 h-4" />
                  <span>Run Simulation</span>
                </button>
                
                <button
                  onClick={() => setStepMode(!stepMode)}
                  className={`px-4 py-3 rounded-lg font-medium border ${stepMode ? 'basic-button' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
                >
                  {stepMode ? 'Step ON' : 'Step OFF'}
                </button>
              </div>
              
              {ganttData.length > 0 && (
                <div className="basic-card p-4 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="basic-text font-bold mb-3 dark:text-white">Gantt Chart Visualization</h3>
                  <GanttChart
                    data={ganttData}
                    isAnimating={isAnimating}
                    currentStep={currentStep}
                    stepMode={stepMode}
                  />
                </div>
              )}
              
              {performanceData && (
                <div className="basic-card p-4 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="basic-text font-bold mb-3 dark:text-white">Performance Metrics</h3>
                  <PerformanceMetrics data={performanceData} />
                </div>
              )}
              
              {performanceData && (
                <button
                  onClick={exportResults}
                  className="w-full basic-button px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Results</span>
                </button>
              )}
            </>
          )}
          
          {currentView === 'typing' && (
            <>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setTypingMode('tutor')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium border ${typingMode === 'tutor' ? 'basic-button' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
                >
                  <Keyboard className="w-4 h-4 inline mr-2" />
                  Typing Tutor
                </button>
                <button
                  onClick={() => setTypingMode('game')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium border ${typingMode === 'game' ? 'basic-button' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  Typing Game
                </button>
              </div>
              
              <div className="basic-card dark:bg-gray-800 dark:border-gray-700">
                {typingMode === 'tutor' ? <TypingTutor /> : <TypingGame />}
              </div>
            </>
          )}
          
          {currentView === 'analytics' && (
            <div className="basic-card text-center py-20 dark:bg-gray-800 dark:border-gray-700">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="basic-title mb-2 dark:text-white">Analytics View</h2>
              <TypingAnimation 
                texts={["Comparing Algorithms", "Analyzing Performance", "Generating Reports"]} 
                speed={100}
                cursorType="pulse"
                className="basic-text dark:text-gray-300"
              />
            </div>
          )}
          
          {currentView === 'settings' && (
            <div className="basic-card text-center py-20 dark:bg-gray-800 dark:border-gray-700">
              <Settings className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="basic-title mb-2 dark:text-white">Settings</h2>
              <p className="basic-text dark:text-gray-300">Configure simulation settings</p>
            </div>
          )}
        </main>

        <nav className="mobile-bottom-nav dark:bg-gray-800 dark:border-gray-700">
          <button
            onClick={() => setCurrentView('home')}
            className={`p-2 ${currentView === 'home' ? 'active' : ''}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView('typing')}
            className={`p-2 ${currentView === 'typing' ? 'active' : ''}`}
          >
            <Keyboard className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`p-2 ${currentView === 'analytics' ? 'active' : ''}`}
          >
            <BarChart3 className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`p-2 ${currentView === 'settings' ? 'active' : ''}`}
          >
            <Settings className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CPU Scheduling Simulator</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</button>
                <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Typing</button>
                <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Analytics</button>
                <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Documentation</button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <TypingAnimation 
                texts={["System Ready", "Monitoring", "Optimized"]} 
                speed={120}
                cursorType="blink"
                className="text-sm text-gray-600 dark:text-gray-400"
              />
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-4 py-2 rounded-lg font-medium border ${currentView === 'home' ? 'basic-button' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
          >
            CPU Simulator
          </button>
          <button
            onClick={() => setCurrentView('typing')}
            className={`px-4 py-2 rounded-lg font-medium border ${currentView === 'typing' ? 'basic-button' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
          >
            Typing Practice
          </button>
        </div>

          {currentView === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="basic-card p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="basic-title mb-4 dark:text-white">Algorithm Control</h3>
                  <AlgorithmSelector
                    selectedAlgorithm={selectedAlgorithm}
                    setSelectedAlgorithm={setSelectedAlgorithm}
                    timeQuantum={timeQuantum}
                    setTimeQuantum={setTimeQuantum}
                  />
                </div>
                
                <div className="basic-card p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="basic-text font-bold mb-3 dark:text-white">Process Input</h3>
                  <ProcessInput
                    processes={processes}
                    setProcesses={setProcesses}
                  />
                </div>
                
                <div className="basic-card p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="basic-text font-bold mb-4 dark:text-white">Simulation Control</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={runSimulation}
                      disabled={processes.length === 0}
                      className="flex-1 basic-button px-4 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center space-x-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      <Play className="w-4 h-4" />
                      <span>Run Simulation</span>
                    </button>
                    
                    <button
                      onClick={() => setStepMode(!stepMode)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium border ${stepMode ? 'basic-button' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
                    >
                      {stepMode ? 'Step ON' : 'Step OFF'}
                    </button>
                    
                    {performanceData && (
                      <button
                        onClick={exportResults}
                        className="flex-1 basic-button px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {ganttData.length > 0 && (
                  <div className="basic-card p-6 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="basic-text font-bold mb-4 dark:text-white">Gantt Chart Visualization</h3>
                    <GanttChart
                      data={ganttData}
                      isAnimating={isAnimating}
                      currentStep={currentStep}
                      stepMode={stepMode}
                    />
                  </div>
                )}
                
                {performanceData && (
                  <div className="basic-card p-6 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="basic-text font-bold mb-4 dark:text-white">Performance Metrics</h3>
                    <PerformanceMetrics data={performanceData} />
                  </div>
                )}
                
                {ganttData.length === 0 && (
                  <div className="basic-card p-12 text-center dark:bg-gray-800 dark:border-gray-700">
                    <Cpu className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="basic-title mb-2 dark:text-white">Ready to Simulate</h3>
                    <p className="basic-text dark:text-gray-300">Add processes and select an algorithm to begin the simulation</p>
                  </div>
                )}
              </div>
            </div>
          )}
        
          {currentView === 'typing' && (
            <div>
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setTypingMode('tutor')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium border ${typingMode === 'tutor' ? 'basic-button' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
                >
                  <Keyboard className="w-4 h-4 inline mr-2" />
                  Typing Tutor
                </button>
                <button
                  onClick={() => setTypingMode('game')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium border ${typingMode === 'game' ? 'basic-button' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  Typing Game
                </button>
              </div>
              
              <div className="basic-card dark:bg-gray-800 dark:border-gray-700">
                {typingMode === 'tutor' ? <TypingTutor /> : <TypingGame />}
              </div>
            </div>
          )}
        </main>
    </div>
  );

  return (
    <div className="App">
      <div className="md:hidden">
        {renderMobileView()}
      </div>
      <div className="hidden md:block">
        {renderDesktopView()}
      </div>
    </div>
  );
}

export default App;
