import React from 'react';
import { Clock, TrendingUp, Activity, BarChart3 } from 'lucide-react';

const PerformanceMetrics = ({ data }) => {
  if (!data) return null;

  const { averageWaitingTime, averageTurnaroundTime, processDetails, totalExecutionTime } = data;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Performance Metrics
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Avg Waiting Time</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {averageWaitingTime.toFixed(2)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Avg Turnaround Time</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {averageTurnaroundTime.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Execution Time</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {totalExecutionTime}
              </p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Process Details Table */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Process Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">Process</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">Arrival</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">Burst</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">Priority</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">Completion</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">Turnaround</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">Waiting</th>
              </tr>
            </thead>
            <tbody>
              {processDetails.map((process, index) => (
                <tr key={process.id} className={`border-b border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                  <td className="py-2 px-3">
                    <span className="font-medium text-gray-900 dark:text-white">{process.id}</span>
                  </td>
                  <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{process.arrivalTime}</td>
                  <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{process.burstTime}</td>
                  <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{process.priority}</td>
                  <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{process.completionTime}</td>
                  <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{process.turnaroundTime}</td>
                  <td className="py-2 px-3">
                    <span className={`font-medium ${process.waitingTime > 5 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {process.waitingTime}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Performance Analysis</h4>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <p>
            • <strong>Efficiency:</strong> {((totalExecutionTime / (totalExecutionTime + averageWaitingTime)) * 100).toFixed(1)}% CPU utilization
          </p>
          <p>
            • <strong>Throughput:</strong> {(processDetails.length / totalExecutionTime).toFixed(3)} processes per time unit
          </p>
          <p>
            • <strong>Response Time:</strong> Average time from arrival to first execution
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
