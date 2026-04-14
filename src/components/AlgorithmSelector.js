import React from 'react';
import { Cpu, Clock, Zap, Flag } from 'lucide-react';

const AlgorithmSelector = ({ selectedAlgorithm, setSelectedAlgorithm, timeQuantum, setTimeQuantum }) => {
  const algorithms = [
    {
      id: 'fcfs',
      name: 'FCFS',
      fullName: 'First Come First Serve',
      description: 'Processes are executed in order of arrival',
      icon: Clock,
      color: 'blue'
    },
    {
      id: 'sjf',
      name: 'SJF',
      fullName: 'Shortest Job First',
      description: 'Shortest burst time processes execute first',
      icon: Zap,
      color: 'green'
    },
    {
      id: 'roundRobin',
      name: 'Round Robin',
      fullName: 'Round Robin',
      description: 'Time-slicing with fixed quantum',
      icon: Cpu,
      color: 'purple'
    },
    {
      id: 'priority',
      name: 'Priority',
      fullName: 'Priority Scheduling',
      description: 'Higher priority processes execute first',
      icon: Flag,
      color: 'orange'
    }
  ];

  const getIcon = (IconComponent, color) => {
    const colorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500'
    };
    return <IconComponent className={`w-5 h-5 ${colorClasses[color]}`} />;
  };

  const getSelectedColor = (color) => {
    const colorClasses = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500',
      green: 'bg-green-100 dark:bg-green-900/30 border-green-500',
      purple: 'bg-purple-100 dark:bg-purple-900/30 border-purple-500',
      orange: 'bg-orange-100 dark:bg-orange-900/30 border-orange-500'
    };
    return colorClasses[color];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Algorithm</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {algorithms.map((algo) => (
          <button
            key={algo.id}
            onClick={() => setSelectedAlgorithm(algo.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedAlgorithm === algo.id
                ? getSelectedColor(algo.color)
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              {getIcon(algo.icon, algo.color)}
              <span className="font-semibold text-gray-900 dark:text-white">{algo.name}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-left">{algo.description}</p>
          </button>
        ))}
      </div>

      {/* Time Quantum for Round Robin */}
      {selectedAlgorithm === 'roundRobin' && (
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
            Time Quantum
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="1"
              max="10"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-purple-900 dark:text-purple-100 w-8">
              {timeQuantum}
            </span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            Each process gets {timeQuantum} time units before switching
          </p>
        </div>
      )}

      {/* Algorithm Info */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Selected:</strong> {algorithms.find(a => a.id === selectedAlgorithm)?.fullName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {algorithms.find(a => a.id === selectedAlgorithm)?.description}
        </p>
      </div>
    </div>
  );
};

export default AlgorithmSelector;
