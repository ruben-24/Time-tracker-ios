import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWorkStore = create(
  persist(
    (set, get) => ({
      // Session state
      isWorking: false,
      isPaused: false,
      sessionStart: null,
      pauseStart: null,
      totalPauseTime: 0,
      pauses: [],
      currentLocation: null,
      
      // Locations
      locations: [
        { id: 1, name: 'Birou Principal', address: 'Wasserburger Str. 15a, 83119 Obing', color: '#667eea' },
        { id: 2, name: 'Lucru Remote', address: 'Casă', color: '#10b981' },
      ],
      
      // Work records
      records: [],
      
      // Actions
      startWork: (locationId) => {
        const location = get().locations.find(l => l.id === locationId);
        set({
          isWorking: true,
          isPaused: false,
          sessionStart: new Date().toISOString(),
          currentLocation: location,
          totalPauseTime: 0,
          pauses: [],
        });
      },
      
      pauseWork: () => {
        const now = new Date().toISOString();
        set(state => ({
          isPaused: true,
          pauseStart: now,
          pauses: [...state.pauses, { start: now, end: null }],
        }));
      },
      
      resumeWork: () => {
        const now = new Date().toISOString();
        set(state => {
          const lastPause = state.pauses[state.pauses.length - 1];
          if (lastPause) {
            const pauseDuration = new Date(now) - new Date(lastPause.start);
            lastPause.end = now;
            lastPause.duration = Math.floor(pauseDuration / 1000);
            
            return {
              isPaused: false,
              pauseStart: null,
              totalPauseTime: state.totalPauseTime + lastPause.duration,
              pauses: [...state.pauses.slice(0, -1), lastPause],
            };
          }
          return { isPaused: false, pauseStart: null };
        });
      },
      
      endWork: () => {
        const state = get();
        const now = new Date().toISOString();
        
        // If paused, complete the pause
        if (state.isPaused) {
          get().resumeWork();
        }
        
        const totalWorkTime = Math.floor((new Date(now) - new Date(state.sessionStart)) / 1000);
        const netWorkTime = totalWorkTime - state.totalPauseTime;
        
        const record = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          startTime: state.sessionStart,
          endTime: now,
          location: state.currentLocation,
          totalWorkTime,
          netWorkTime,
          totalPauseTime: state.totalPauseTime,
          pauses: state.pauses,
          isManual: false,
        };
        
        set(state => ({
          records: [record, ...state.records],
          isWorking: false,
          isPaused: false,
          sessionStart: null,
          pauseStart: null,
          currentLocation: null,
          totalPauseTime: 0,
          pauses: [],
        }));
      },
      
      addManualRecord: (record) => {
        set(state => ({
          records: [{ ...record, id: Date.now(), isManual: true }, ...state.records],
        }));
      },
      
      deleteRecord: (id) => {
        set(state => ({
          records: state.records.filter(r => r.id !== id),
        }));
      },
      
      updateLocation: (id, updates) => {
        set(state => ({
          locations: state.locations.map(loc => 
            loc.id === id ? { ...loc, ...updates } : loc
          ),
        }));
      },
      
      exportData: () => {
        const data = {
          records: get().records,
          locations: get().locations,
          exportDate: new Date().toISOString(),
          version: '2.0',
        };
        return JSON.stringify(data, null, 2);
      },
      
      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          set({
            records: data.records || [],
            locations: data.locations || get().locations,
          });
          return true;
        } catch (error) {
          console.error('Import error:', error);
          return false;
        }
      },
      
      clearAllData: () => {
        set({
          records: [],
          isWorking: false,
          isPaused: false,
          sessionStart: null,
          pauseStart: null,
          currentLocation: null,
          totalPauseTime: 0,
          pauses: [],
        });
      },
    }),
    {
      name: 'worktime-storage',
    }
  )
);

export default useWorkStore;
