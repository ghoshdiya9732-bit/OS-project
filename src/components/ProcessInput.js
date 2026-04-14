import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const ProcessInput = ({ processes, setProcesses }) => {
  const [newProcess, setNewProcess] = useState({
    id: '',
    arrivalTime: '',
    burstTime: '',
    priority: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleInputChange = (field, value) => {
    setNewProcess(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addProcess = () => {
    if (!newProcess.id || !newProcess.arrivalTime || !newProcess.burstTime) {
      alert('Please fill in all required fields');
      return;
    }

    const process = {
      id: newProcess.id,
      arrivalTime: parseInt(newProcess.arrivalTime),
      burstTime: parseInt(newProcess.burstTime),
      priority: newProcess.priority ? parseInt(newProcess.priority) : 0
    };

    setProcesses(prev => [...prev, process]);
    setNewProcess({
      id: '',
      arrivalTime: '',
      burstTime: '',
      priority: ''
    });
  };

  const deleteProcess = (id) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  const startEdit = (process) => {
    setEditingId(process.id);
    setEditForm({
      id: process.id,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority
    });
  };

  const saveEdit = () => {
    if (!editForm.id || !editForm.arrivalTime || !editForm.burstTime) {
      alert('Please fill in all required fields');
      return;
    }

    setProcesses(prev => prev.map(p => 
      p.id === editingId 
        ? {
            ...p,
            id: editForm.id,
            arrivalTime: parseInt(editForm.arrivalTime),
            burstTime: parseInt(editForm.burstTime),
            priority: editForm.priority ? parseInt(editForm.priority) : 0
          }
        : p
    ));
    
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const addSampleProcesses = () => {
    const sampleProcesses = [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
      { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 4 }
    ];
    setProcesses(sampleProcesses);
  };

  const clearAll = () => {
    setProcesses([]);
    setNewProcess({
      id: '',
      arrivalTime: '',
      burstTime: '',
      priority: ''
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Process Input</h3>
        <div className="flex space-x-2">
          <button
            onClick={addSampleProcesses}
            className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Add Sample
          </button>
          <button
            onClick={clearAll}
            className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Add New Process Form */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Process ID"
            value={newProcess.id}
            onChange={(e) => handleInputChange('id', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
          <input
            type="number"
            placeholder="Arrival Time"
            value={newProcess.arrivalTime}
            onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
            min="0"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Burst Time"
            value={newProcess.burstTime}
            onChange={(e) => handleInputChange('burstTime', e.target.value)}
            min="1"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
          <input
            type="number"
            placeholder="Priority (optional)"
            value={newProcess.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            min="1"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
        <button
          onClick={addProcess}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Process</span>
        </button>
      </div>

      {/* Process Table */}
      {processes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300 font-medium">ID</th>
                <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300 font-medium">Arrival</th>
                <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300 font-medium">Burst</th>
                <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300 font-medium">Priority</th>
                <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="border-b border-gray-100 dark:border-gray-700">
                  {editingId === process.id ? (
                    <>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={editForm.id}
                          onChange={(e) => handleEditInputChange('id', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-xs"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={editForm.arrivalTime}
                          onChange={(e) => handleEditInputChange('arrivalTime', e.target.value)}
                          min="0"
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-xs"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={editForm.burstTime}
                          onChange={(e) => handleEditInputChange('burstTime', e.target.value)}
                          min="1"
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-xs"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={editForm.priority}
                          onChange={(e) => handleEditInputChange('priority', e.target.value)}
                          min="1"
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-xs"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={saveEdit}
                            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                          >
                            <Save className="w-3 h-3" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-2 text-gray-900 dark:text-white font-medium">{process.id}</td>
                      <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{process.arrivalTime}</td>
                      <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{process.burstTime}</td>
                      <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{process.priority}</td>
                      <td className="py-2 px-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => startEdit(process)}
                            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteProcess(process.id)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {processes.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          No processes added yet. Add processes to start simulation.
        </div>
      )}
    </div>
  );
};

export default ProcessInput;
