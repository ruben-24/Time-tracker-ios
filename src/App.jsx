import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, Play, Pause, StopCircle, History, Settings, MapPin, TrendingUp, ArrowLeft, Edit2, Check, X, Coffee, Download, Upload, PlusCircle, Calendar, Trash2, AlertCircle, Info, Zap } from 'lucide-react';

// Constants
const DEFAULT_LOCATION_1 = "Wasserburger Str. 15a, 83119 Obing";
const DEFAULT_LOCATION_2 = "Adresa personalizată";
const STORAGE_KEY = 'workTimeDataDual';
const APP_VERSION = '2.1.0';

// Intra JN Configuration
const INTRA_JN_CONFIG = {
  companyName: "Intra JN",
  maxWorkHours: 12,
  minBreakDuration: 15, // minutes
  maxBreakDuration: 60, // minutes
  overtimeThreshold: 8, // hours
  features: {
    smartNotifications: true,
    autoPause: false,
    locationTracking: true,
    dataAnalytics: true
  }
};

// iOS Keyboard Management Hook
const useIOSKeyboard = () => {
  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // Prevent zoom on input focus
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Add iOS-specific styles
      const style = document.createElement('style');
      style.textContent = `
        input[type="number"] {
          -webkit-appearance: none;
          -moz-appearance: textfield;
          appearance: none;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input:focus {
          -webkit-user-select: text;
          user-select: text;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
};

// Utility Functions
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const formatDigitalTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatPauseTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatExactTime = (date) => {
  return new Date(date).toLocaleTimeString('ro-RO', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

// Validation Functions
const validateWorkSession = (startTime, endTime, pauses = []) => {
  const errors = [];
  
  if (endTime <= startTime) {
    errors.push('Ora de final trebuie să fie după ora de start!');
  }
  
  const workDuration = Math.floor((endTime - startTime) / 1000);
  const totalPauseDuration = pauses.reduce((sum, pause) => sum + pause.duration, 0);
  const netWorkTime = workDuration - totalPauseDuration;
  
  if (netWorkTime < 0) {
    errors.push('Timpul de pauză nu poate depăși timpul total de lucru!');
  }
  
  if (netWorkTime > INTRA_JN_CONFIG.maxWorkHours * 3600) {
    errors.push(`Timpul de lucru nu poate depăși ${INTRA_JN_CONFIG.maxWorkHours} ore!`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// COMPONENT SEPARAT PENTRU MANUAL ENTRY - IZOLAT DE RE-RENDERS
const ManualEntryModal = React.memo(({ 
  showManualEntry, 
  setShowManualEntry, 
  activeLocation, 
  location2Custom, 
  workRecords, 
  setWorkRecords, 
  formatExactTime 
}) => {
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualStartHour, setManualStartHour] = useState('09');
  const [manualStartMinute, setManualStartMinute] = useState('00');
  const [manualStartSecond, setManualStartSecond] = useState('00');
  const [manualEndHour, setManualEndHour] = useState('17');
  const [manualEndMinute, setManualEndMinute] = useState('00');
  const [manualEndSecond, setManualEndSecond] = useState('00');
  const [manualLocation, setManualLocation] = useState(activeLocation);
  const [manualPauses, setManualPauses] = useState([]);
  const [focusedInput, setFocusedInput] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (showManualEntry) {
      setManualDate(new Date().toISOString().split('T')[0]);
      setManualStartHour('09');
      setManualStartMinute('00');
      setManualStartSecond('00');
      setManualEndHour('17');
      setManualEndMinute('00');
      setManualEndSecond('00');
      setManualLocation(activeLocation);
      setManualPauses([]);
      setFocusedInput(null);
    }
  }, [showManualEntry, activeLocation]);

  // iOS-specific focus handling
  useEffect(() => {
    if (focusedInput && showManualEntry) {
      // For iOS, we need to be more aggressive with focus management
      const timer = setTimeout(() => {
        const element = document.querySelector(`input[placeholder="${focusedInput.includes('HH') ? 'HH' : focusedInput.includes('MM') ? 'MM' : 'SS'}"]`);
        if (element) {
          // Force focus on iOS
          element.focus();
          element.click();
          // Prevent blur events that cause keyboard to close
          element.addEventListener('blur', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => element.focus(), 10);
          }, { once: true });
        }
      }, 50); // Shorter timeout for iOS
      return () => clearTimeout(timer);
    }
  }, [focusedInput, showManualEntry]);

  // iOS keyboard management
  useEffect(() => {
    if (showManualEntry) {
      // Prevent body scroll on iOS when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [showManualEntry]);

  const addManualPause = useCallback(() => {
    setManualPauses(prev => [...prev, { 
      startHour: '12', startMinute: '00', startSecond: '00',
      endHour: '12', endMinute: '30', endSecond: '00'
    }]);
  }, []);

  const updateManualPause = useCallback((index, field, value) => {
    setManualPauses(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removeManualPause = useCallback((index) => {
    setManualPauses(prev => prev.filter((_, i) => i !== index));
  }, []);

  const saveManualEntry = useCallback(() => {
    try {
      const startTimeStr = `${manualStartHour.padStart(2, '0')}:${manualStartMinute.padStart(2, '0')}:${manualStartSecond.padStart(2, '0')}`;
      const endTimeStr = `${manualEndHour.padStart(2, '0')}:${manualEndMinute.padStart(2, '0')}:${manualEndSecond.padStart(2, '0')}`;
      
      const startDateTime = new Date(`${manualDate}T${startTimeStr}`);
      const endDateTime = new Date(`${manualDate}T${endTimeStr}`);
      
      const processedPauses = manualPauses.map(pause => {
        const pauseStartStr = `${pause.startHour.padStart(2, '0')}:${pause.startMinute.padStart(2, '0')}:${pause.startSecond.padStart(2, '0')}`;
        const pauseEndStr = `${pause.endHour.padStart(2, '0')}:${pause.endMinute.padStart(2, '0')}:${pause.endSecond.padStart(2, '0')}`;
        
        const pauseStart = new Date(`${manualDate}T${pauseStartStr}`);
        const pauseEnd = new Date(`${manualDate}T${pauseEndStr}`);
        const duration = Math.floor((pauseEnd - pauseStart) / 1000);
        
        return {
          start: pauseStart.toISOString(),
          end: pauseEnd.toISOString(),
          startFormatted: formatExactTime(pauseStart),
          endFormatted: formatExactTime(pauseEnd),
          duration
        };
      });

      // Validate the work session
      const validation = validateWorkSession(startDateTime, endDateTime, processedPauses);
      if (!validation.isValid) {
        alert(`❌ ${validation.errors.join('\n')}`);
        return;
      }

      const totalWorkSeconds = Math.floor((endDateTime - startDateTime) / 1000);
      const totalPauseDuration = processedPauses.reduce((sum, p) => sum + p.duration, 0);
      const workDuration = totalWorkSeconds - totalPauseDuration;

      const record = {
        date: manualDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        workDuration,
        pauseDuration: totalPauseDuration,
        pauseHistory: processedPauses,
        location: manualLocation === 1 ? DEFAULT_LOCATION_1 : location2Custom,
        manual: true,
        company: INTRA_JN_CONFIG.companyName,
        version: APP_VERSION
      };

      const locationKey = manualLocation === 1 ? 'location1' : 'location2';
      setWorkRecords(prev => ({
        ...prev,
        [locationKey]: [...prev[locationKey], record].sort((a, b) => 
          new Date(b.startTime) - new Date(a.startTime)
        )
      }));

      alert('✅ Sesiune adăugată cu succes!');
      setShowManualEntry(false);
    } catch (error) {
      alert('❌ Eroare la salvare!');
      console.error(error);
    }
  }, [manualDate, manualStartHour, manualStartMinute, manualStartSecond, manualEndHour, manualEndMinute, manualEndSecond, manualPauses, manualLocation, location2Custom, setWorkRecords, setShowManualEntry, formatExactTime]);

  // Time input component optimized for iOS
  const TimeInput = React.memo(({ value, onChange, placeholder, onFocus, onBlur }) => (
    <input
      type="number"
      min="0"
      max={placeholder === "HH" ? "23" : "59"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => {
        e.preventDefault();
        onFocus();
        // iOS-specific: prevent keyboard from closing
        e.target.setAttribute('readonly', 'readonly');
        setTimeout(() => e.target.removeAttribute('readonly'), 100);
      }}
      onBlur={(e) => {
        e.preventDefault();
        onBlur();
      }}
      placeholder={placeholder}
      className="w-full px-3 py-3 bg-white/10 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{ 
        WebkitAppearance: 'none',
        MozAppearance: 'textfield',
        appearance: 'none'
      }}
      inputMode="numeric"
      pattern="[0-9]*"
    />
  ));

  // Small time input for pauses - optimized for iOS
  const SmallTimeInput = React.memo(({ value, onChange, placeholder, onFocus, onBlur }) => (
    <input
      type="number"
      min="0"
      max={placeholder === "HH" ? "23" : "59"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => {
        e.preventDefault();
        onFocus();
        // iOS-specific: prevent keyboard from closing
        e.target.setAttribute('readonly', 'readonly');
        setTimeout(() => e.target.removeAttribute('readonly'), 100);
      }}
      onBlur={(e) => {
        e.preventDefault();
        onBlur();
      }}
      placeholder={placeholder}
      className="px-2 py-2 bg-white/10 rounded text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-yellow-500"
      style={{ 
        WebkitAppearance: 'none',
        MozAppearance: 'textfield',
        appearance: 'none'
      }}
      inputMode="numeric"
      pattern="[0-9]*"
    />
  ));

  if (!showManualEntry) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
      style={{
        WebkitOverflowScrolling: 'touch',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="min-h-screen px-4 py-8" style={{ minHeight: '100vh' }}>
        <div 
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md mx-auto"
          style={{
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            willChange: 'transform'
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-6 h-6" />
              Adaugă Sesiune Manual
            </h3>
            <button 
              onClick={() => setShowManualEntry(false)} 
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">📅 Data:</label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                onFocus={(e) => {
                  e.preventDefault();
                  // iOS-specific: prevent keyboard from closing
                  e.target.setAttribute('readonly', 'readonly');
                  setTimeout(() => e.target.removeAttribute('readonly'), 100);
                }}
                className="w-full px-3 py-3 bg-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                  appearance: 'none'
                }}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">🕐 Ora Start (HH:MM:SS):</label>
              <div className="grid grid-cols-3 gap-2">
                <TimeInput
                  value={manualStartHour}
                  onChange={setManualStartHour}
                  placeholder="HH"
                  onFocus={() => setFocusedInput('startHour')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TimeInput
                  value={manualStartMinute}
                  onChange={setManualStartMinute}
                  placeholder="MM"
                  onFocus={() => setFocusedInput('startMinute')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TimeInput
                  value={manualStartSecond}
                  onChange={setManualStartSecond}
                  placeholder="SS"
                  onFocus={() => setFocusedInput('startSecond')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">🕐 Ora Final (HH:MM:SS):</label>
              <div className="grid grid-cols-3 gap-2">
                <TimeInput
                  value={manualEndHour}
                  onChange={setManualEndHour}
                  placeholder="HH"
                  onFocus={() => setFocusedInput('endHour')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TimeInput
                  value={manualEndMinute}
                  onChange={setManualEndMinute}
                  placeholder="MM"
                  onFocus={() => setFocusedInput('endMinute')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TimeInput
                  value={manualEndSecond}
                  onChange={setManualEndSecond}
                  placeholder="SS"
                  onFocus={() => setFocusedInput('endSecond')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">📍 Locație:</label>
              <select
                value={manualLocation}
                onChange={(e) => setManualLocation(parseInt(e.target.value))}
                onFocus={(e) => {
                  e.preventDefault();
                  // iOS-specific: prevent keyboard from closing
                  e.target.setAttribute('readonly', 'readonly');
                  setTimeout(() => e.target.removeAttribute('readonly'), 100);
                }}
                className="w-full px-3 py-3 bg-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                  appearance: 'none'
                }}
              >
                <option value={1}>Locație 1</option>
                <option value={2}>Locație 2</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm text-gray-300">☕ Pauze:</label>
                <button
                  onClick={addManualPause}
                  className="text-xs bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-lg flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Adaugă
                </button>
              </div>

              {manualPauses.map((pause, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-yellow-400 font-semibold">Pauza {index + 1}</span>
                    <button
                      onClick={() => removeManualPause(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Start:</p>
                      <div className="grid grid-cols-3 gap-2">
                        <SmallTimeInput
                          value={pause.startHour}
                          onChange={(value) => updateManualPause(index, 'startHour', value)}
                          placeholder="HH"
                          onFocus={() => setFocusedInput(`pause-${index}-startHour`)}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <SmallTimeInput
                          value={pause.startMinute}
                          onChange={(value) => updateManualPause(index, 'startMinute', value)}
                          placeholder="MM"
                          onFocus={() => setFocusedInput(`pause-${index}-startMinute`)}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <SmallTimeInput
                          value={pause.startSecond}
                          onChange={(value) => updateManualPause(index, 'startSecond', value)}
                          placeholder="SS"
                          onFocus={() => setFocusedInput(`pause-${index}-startSecond`)}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Final:</p>
                      <div className="grid grid-cols-3 gap-2">
                        <SmallTimeInput
                          value={pause.endHour}
                          onChange={(value) => updateManualPause(index, 'endHour', value)}
                          placeholder="HH"
                          onFocus={() => setFocusedInput(`pause-${index}-endHour`)}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <SmallTimeInput
                          value={pause.endMinute}
                          onChange={(value) => updateManualPause(index, 'endMinute', value)}
                          placeholder="MM"
                          onFocus={() => setFocusedInput(`pause-${index}-endMinute`)}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <SmallTimeInput
                          value={pause.endSecond}
                          onChange={(value) => updateManualPause(index, 'endSecond', value)}
                          placeholder="SS"
                          onFocus={() => setFocusedInput(`pause-${index}-endSecond`)}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={saveManualEntry}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Salvează
              </button>
              <button
                onClick={() => setShowManualEntry(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 rounded-xl"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// COMPONENTA PRINCIPALĂ
const TimeTrackerApp = () => {
  const [activeLocation, setActiveLocation] = useState(1);
  const [location2Custom, setLocation2Custom] = useState(DEFAULT_LOCATION_2);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  
  const [isAtWork, setIsAtWork] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [totalPauseTime, setTotalPauseTime] = useState(0);
  const [pauseHistory, setPauseHistory] = useState([]);
  const [workRecords, setWorkRecords] = useState({ location1: [], location2: [] });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState('main');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // iOS keyboard management
  useIOSKeyboard();

  // Memoize the manual entry modal props to prevent re-renders
  const manualEntryProps = useMemo(() => ({
    showManualEntry,
    setShowManualEntry,
    activeLocation,
    location2Custom,
    workRecords,
    setWorkRecords,
    formatExactTime
  }), [showManualEntry, setShowManualEntry, activeLocation, location2Custom, workRecords, setWorkRecords, formatExactTime]);

  const getCurrentLocation = () => activeLocation === 1 ? DEFAULT_LOCATION_1 : location2Custom;
  const getLocationKey = () => activeLocation === 1 ? 'location1' : 'location2';

  const getCurrentPauseDuration = () => {
    if (!isPaused || !pauseStartTime) return 0;
    return Math.floor((currentTime - pauseStartTime) / 1000);
  };

  // Notification system
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only last 5
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWorkRecords(parsed.workRecords || { location1: [], location2: [] });
        setLocation2Custom(parsed.location2Custom || DEFAULT_LOCATION_2);
        setActiveLocation(parsed.activeLocation || 1);
        
        if (parsed.currentSession && parsed.currentSession.location === (parsed.activeLocation || 1)) {
          setIsAtWork(parsed.currentSession.isAtWork || false);
          setIsPaused(parsed.currentSession.isPaused || false);
          setStartTime(parsed.currentSession.startTime ? new Date(parsed.currentSession.startTime) : null);
          setPauseStartTime(parsed.currentSession.pauseStartTime ? new Date(parsed.currentSession.pauseStartTime) : null);
          setTotalPauseTime(parsed.currentSession.totalPauseTime || 0);
          setPauseHistory(parsed.currentSession.pauseHistory || []);
        }
        
        // Show welcome notification for Intra JN
        if (parsed.version !== APP_VERSION) {
          addNotification(`Bun venit la ${INTRA_JN_CONFIG.companyName} Time Tracker v${APP_VERSION}!`, 'success');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        addNotification('Eroare la încărcarea datelor salvate', 'error');
      }
    } else {
      addNotification(`Bun venit la ${INTRA_JN_CONFIG.companyName} Time Tracker!`, 'success');
    }
  }, [addNotification]);

  // Save data to localStorage
  useEffect(() => {
    const data = {
      workRecords,
      location2Custom,
      activeLocation,
      version: APP_VERSION,
      company: INTRA_JN_CONFIG.companyName,
      currentSession: {
        location: activeLocation,
        isAtWork,
        isPaused,
        startTime: startTime ? startTime.toISOString() : null,
        pauseStartTime: pauseStartTime ? pauseStartTime.toISOString() : null,
        totalPauseTime,
        pauseHistory
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [isAtWork, isPaused, startTime, pauseStartTime, totalPauseTime, pauseHistory, workRecords, activeLocation, location2Custom]);

  // Smart notifications based on work patterns
  useEffect(() => {
    if (!isAtWork || !startTime) return;

    const currentSessionTime = getCurrentSessionTime();
    const hours = currentSessionTime / 3600;

    // Overtime warning
    if (hours >= INTRA_JN_CONFIG.overtimeThreshold && hours < INTRA_JN_CONFIG.overtimeThreshold + 0.1) {
      addNotification(`⚠️ Ai atins ${INTRA_JN_CONFIG.overtimeThreshold} ore de lucru!`, 'warning');
    }

    // Maximum work hours warning
    if (hours >= INTRA_JN_CONFIG.maxWorkHours && hours < INTRA_JN_CONFIG.maxWorkHours + 0.1) {
      addNotification(`🚨 Ai atins limita maximă de ${INTRA_JN_CONFIG.maxWorkHours} ore!`, 'error');
    }
  }, [isAtWork, startTime, addNotification]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const getCurrentSessionTime = () => {
    if (!startTime) return 0;
    const current = isPaused ? pauseStartTime : currentTime;
    return Math.floor((current - startTime) / 1000) - totalPauseTime;
  };

  const startWork = () => {
    setIsAtWork(true);
    setStartTime(new Date());
    setTotalPauseTime(0);
    setIsPaused(false);
    setPauseHistory([]);
    addNotification(`🚀 Ai început lucrul la ${getCurrentLocation()}`, 'success');
  };

  const pauseWork = () => {
    setIsPaused(true);
    const now = new Date();
    setPauseStartTime(now);
    setPauseHistory([...pauseHistory, {
      start: now.toISOString(),
      startFormatted: formatExactTime(now)
    }]);
    addNotification('⏸️ Ai intrat în pauză', 'info');
  };

  const resumeWork = () => {
    if (isPaused && pauseStartTime) {
      const pauseEnd = new Date();
      const pauseDuration = Math.floor((pauseEnd - pauseStartTime) / 1000);
      setTotalPauseTime(totalPauseTime + pauseDuration);
      setIsPaused(false);
      
      const updatedHistory = [...pauseHistory];
      if (updatedHistory.length > 0) {
        updatedHistory[updatedHistory.length - 1].end = pauseEnd.toISOString();
        updatedHistory[updatedHistory.length - 1].endFormatted = formatExactTime(pauseEnd);
        updatedHistory[updatedHistory.length - 1].duration = pauseDuration;
      }
      setPauseHistory(updatedHistory);
      setPauseStartTime(null);
      addNotification('▶️ Ai revenit la lucru', 'success');
    }
  };

  const endWork = () => {
    const endTime = new Date();
    const workDuration = getCurrentSessionTime();
    const pauseDuration = totalPauseTime;
    
    const record = {
      date: new Date().toISOString().split('T')[0],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      workDuration,
      pauseDuration,
      pauseHistory,
      location: getCurrentLocation(),
      company: INTRA_JN_CONFIG.companyName,
      version: APP_VERSION
    };
    
    const locationKey = getLocationKey();
    setWorkRecords({
      ...workRecords,
      [locationKey]: [...workRecords[locationKey], record]
    });
    
    // Calculate work statistics
    const hours = workDuration / 3600;
    const isOvertime = hours > INTRA_JN_CONFIG.overtimeThreshold;
    
    setIsAtWork(false);
    setIsPaused(false);
    setStartTime(null);
    setPauseStartTime(null);
    setTotalPauseTime(0);
    setPauseHistory([]);
    
    // Show completion notification
    if (isOvertime) {
      addNotification(`🏆 Program finalizat! ${formatDuration(workDuration)} (${hours.toFixed(1)}h) - OVERTIME!`, 'success');
    } else {
      addNotification(`✅ Program finalizat! ${formatDuration(workDuration)} (${hours.toFixed(1)}h)`, 'success');
    }
  };

  const switchLocation = (loc) => {
    if (isAtWork) {
      alert('Nu poți schimba locația în timpul programului! Termină mai întâi.');
      return;
    }
    setActiveLocation(loc);
  };

  const saveCustomLocation = () => {
    if (tempLocation.trim()) {
      setLocation2Custom(tempLocation.trim());
      setIsEditingLocation(false);
      setTempLocation("");
    }
  };

  const resetCurrentSession = () => {
    if (window.confirm('Ești sigur că vrei să resetezi sesiunea curentă?')) {
      setIsAtWork(false);
      setIsPaused(false);
      setStartTime(null);
      setPauseStartTime(null);
      setTotalPauseTime(0);
      setPauseHistory([]);
    }
  };

  const clearAllData = () => {
    if (window.confirm('ATENȚIE! Această acțiune va șterge TOATE datele. Ești sigur?')) {
      localStorage.removeItem('workTimeDataDual');
      setWorkRecords({ location1: [], location2: [] });
      resetCurrentSession();
    }
  };

  const exportData = () => {
    const data = {
      workRecords,
      location2Custom,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('✅ Date exportate cu succes!');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        
        if (window.confirm('Ești sigur? Datele curente vor fi ÎNLOCUITE cu cele din backup!')) {
          setWorkRecords(imported.workRecords || { location1: [], location2: [] });
          setLocation2Custom(imported.location2Custom || DEFAULT_LOCATION_2);
          alert('✅ Date importate cu succes!');
        }
      } catch (error) {
        alert('❌ Eroare: Fișier invalid!');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Notification Component
  const NotificationPanel = () => {
    if (notifications.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg backdrop-blur-lg border-l-4 ${
              notification.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-100'
                : notification.type === 'warning'
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-100'
                : notification.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-100'
                : 'bg-blue-500/20 border-blue-500 text-blue-100'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                {notification.type === 'success' && <Check className="w-5 h-5" />}
                {notification.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                {notification.type === 'error' && <X className="w-5 h-5" />}
                {notification.type === 'info' && <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {notification.timestamp.toLocaleTimeString('ro-RO')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const DynamicIslandWidget = () => {
    if (!isPaused) return null;
    
    const pauseDuration = getCurrentPauseDuration();
    
    return (
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2">
        <div className="bg-black rounded-full px-8 py-3 shadow-2xl border border-yellow-500/30 animate-pulse-slow">
          <div className="flex items-center gap-3">
            <Coffee className="w-5 h-5 text-yellow-400" />
            <div className="text-center">
              <div className="text-yellow-400 text-xs font-semibold mb-0.5">PAUZĂ</div>
              <div className="text-white text-xl font-mono font-bold tracking-wider">
                {formatPauseTimer(pauseDuration)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <NotificationPanel />
      <DynamicIslandWidget />
      <ManualEntryModal {...manualEntryProps} />
      
      <div className="h-16"></div>
      
      <div className="px-6 pb-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Zap className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold">{INTRA_JN_CONFIG.companyName}</h1>
                <p className="text-sm text-gray-400">Time Tracker v{APP_VERSION}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => switchLocation(1)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                  activeLocation === 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                📍 Locație 1
              </button>
              <button
                onClick={() => switchLocation(2)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                  activeLocation === 2
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                📍 Locație 2
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3">
              <div className="flex items-center justify-between gap-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <p className="text-sm text-gray-200 flex-1">{getCurrentLocation()}</p>
                {activeLocation === 2 && !isEditingLocation && (
                  <button
                    onClick={() => {
                      setTempLocation(location2Custom);
                      setIsEditingLocation(true);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditingLocation && (
                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    placeholder="Introdu adresa..."
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                    <div className="flex gap-2">
                    <button
                      onClick={saveCustomLocation}
                      className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Salvează
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingLocation(false);
                        setTempLocation("");
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Anulează
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isPaused && (
            <div className="mb-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-400/50 shadow-2xl animate-pulse-slow">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Coffee className="w-6 h-6 text-yellow-400" />
                  <p className="text-yellow-400 text-lg font-bold">TIMER PAUZĂ</p>
                </div>
                <div className="text-7xl font-bold text-white mb-2 font-mono tracking-tight">
                  {formatPauseTimer(getCurrentPauseDuration())}
                </div>
                <p className="text-yellow-200 text-sm">
                  {Math.floor(getCurrentPauseDuration() / 60)} minute · {getCurrentPauseDuration() % 60} secunde
                </p>
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-2xl">
            {!isAtWork ? (
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-300 text-xl mb-2">NU EȘTI LA MUNCĂ</p>
                <p className="text-gray-500 text-sm">Apasă pentru a începe</p>
              </div>
            ) : isPaused ? (
              <div className="text-center">
                <div className="text-6xl mb-4">⏸️</div>
                <p className="text-yellow-400 text-xl mb-4">ÎN PAUZĂ</p>
                <div className="text-5xl font-bold mb-6">{formatDigitalTime(getCurrentSessionTime())}</div>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-400">⏰ Timp lucrat:</span>
                    <span className="font-semibold">{formatDuration(getCurrentSessionTime())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">⏸️ Pauze anterioare:</span>
                    <span className="font-semibold">{formatDuration(totalPauseTime)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">🟢</div>
                <p className="text-green-400 text-xl mb-4">LUCRU ACTIV</p>
                <div className="text-5xl font-bold mb-6">{formatDigitalTime(getCurrentSessionTime())}</div>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-400">🕐 Start:</span>
                    <span className="font-semibold">{formatExactTime(startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">⏸️ Pauze totale:</span>
                    <span className="font-semibold">{formatDuration(totalPauseTime)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            {!isAtWork ? (
              <button
                onClick={startWork}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition text-lg shadow-lg"
              >
                <Play className="w-6 h-6" />
                Începe Lucrul
              </button>
            ) : isPaused ? (
              <button
                onClick={resumeWork}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition text-lg shadow-lg"
              >
                <Play className="w-6 h-6" />
                Reia Lucrul
              </button>
            ) : (
              <>
                <button
                  onClick={pauseWork}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition text-lg shadow-lg"
                >
                  <Pause className="w-6 h-6" />
                  Pauză
                </button>
                <button
                  onClick={endWork}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition text-lg shadow-lg"
                >
                  <StopCircle className="w-6 h-6" />
                  Încheie Programul
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setActiveView('history')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <History className="w-5 h-5" />
              Istoric
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Settings className="w-5 h-5" />
              Setări
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            {currentTime.toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <br />
            {currentTime.toLocaleTimeString('ro-RO')}
          </div>
        </div>
      </div>
      
      <div className="h-8"></div>
    </div>
  );

  const HistoryView = () => {
    const currentRecords = workRecords[getLocationKey()] || [];
    const sortedRecords = [...currentRecords].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <NotificationPanel />
        <DynamicIslandWidget />
        <ManualEntryModal {...manualEntryProps} />
        
        <div className="h-16"></div>
        
        <div className="px-6 pb-10">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setActiveView('main')}
              className="mb-6 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Înapoi
            </button>
            
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Istoric Detaliat - {activeLocation === 1 ? 'Locație 1' : 'Locație 2'}
            </h2>

            <div className="mb-4 p-3 bg-blue-500/20 rounded-xl text-sm">
              <p className="font-semibold">📍 {getCurrentLocation()}</p>
            </div>

            <button
              onClick={() => setShowManualEntry(true)}
              className="w-full mb-6 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-5 h-5" />
              Adaugă Sesiune Manual
            </button>

            {sortedRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl">Nu există înregistrări</p>
                <p className="text-gray-400 text-sm mt-2">pentru această locație</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedRecords.map((record, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-lg font-bold">
                          {new Date(record.startTime).toLocaleDateString('ro-RO', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        {record.manual && (
                          <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded mt-1 inline-block">
                            ✍️ Manual
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">{formatDuration(record.workDuration)}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">🕐 Început lucru:</span>
                          <span className="font-semibold font-mono">{formatExactTime(record.startTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">🕐 Sfârșit lucru:</span>
                          <span className="font-semibold font-mono">{formatExactTime(record.endTime)}</span>
                        </div>
                      </div>

                      {record.pauseHistory && record.pauseHistory.length > 0 && (
                        <div className="border-t border-white/10 pt-3">
                          <p className="text-gray-400 mb-2">☕ Pauze ({record.pauseHistory.length}):</p>
                          {record.pauseHistory.map((pause, pIndex) => (
                            <div key={pIndex} className="bg-white/5 rounded-lg p-3 mb-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-yellow-400 font-semibold">Pauza {pIndex + 1}</span>
                                <span className="text-yellow-400 font-bold">{formatDuration(pause.duration || 0)}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Start: <span className="font-mono">{pause.startFormatted || formatExactTime(pause.start)}</span></span>
                                <span className="text-gray-400">Final: <span className="font-mono">{pause.endFormatted || formatExactTime(pause.end)}</span></span>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between mt-2 text-yellow-400 font-semibold">
                            <span>Total pauze:</span>
                            <span>{formatDuration(record.pauseDuration)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="h-8"></div>
      </div>
    );
  };

  const SettingsView = () => {
    const loc1Count = workRecords.location1?.length || 0;
    const loc2Count = workRecords.location2?.length || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <NotificationPanel />
        <DynamicIslandWidget />
        
        <div className="h-16"></div>
        
        <div className="px-6 pb-10">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setActiveView('main')}
              className="mb-6 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Înapoi
            </button>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Setări
            </h2>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Backup & Restore
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={exportData}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    Exportă Date (JSON)
                  </button>
                  
                  <label className="block">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                      id="import-file"
                    />
                    <div
                      onClick={() => document.getElementById('import-file').click()}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Importă Date (JSON)
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={resetCurrentSession}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-white font-semibold py-4 px-6 rounded-xl transition"
              >
                🔄 Resetează Sesiunea Curentă
              </button>
              
              <button
                onClick={clearAllData}
                className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-white font-semibold py-4 px-6 rounded-xl transition"
              >
                🗑️ Șterge Toate Datele
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl text-sm">
                <p className="font-semibold mb-3 text-blue-400">ℹ️ Informații Generale:</p>
                <p className="text-gray-300">• Status: {isAtWork ? (isPaused ? 'În pauză' : 'Activ') : 'Inactiv'}</p>
                <p className="text-gray-300">• Locație activă: {activeLocation === 1 ? 'Locație 1' : 'Locație 2'}</p>
                <p className="text-gray-300">• Companie: {INTRA_JN_CONFIG.companyName}</p>
                <p className="text-gray-300">• Versiune: {APP_VERSION}</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl text-sm">
                <p className="font-semibold mb-3 text-green-400">📊 Statistici pe Locații:</p>
                <p className="text-gray-300">• Locație 1: {loc1Count} sesiuni</p>
                <p className="text-gray-300 text-xs ml-4 mt-1">{DEFAULT_LOCATION_1}</p>
                <p className="text-gray-300 mt-2">• Locație 2: {loc2Count} sesiuni</p>
                <p className="text-gray-300 text-xs ml-4 mt-1">{location2Custom}</p>
              </div>

              <div className="p-4 bg-yellow-500/20 rounded-xl text-sm">
                <p className="font-semibold mb-2 text-yellow-400">⚙️ Configurație Intra JN:</p>
                <p className="text-gray-300 text-xs">• Ore maxime: {INTRA_JN_CONFIG.maxWorkHours}h</p>
                <p className="text-gray-300 text-xs">• Prag overtime: {INTRA_JN_CONFIG.overtimeThreshold}h</p>
                <p className="text-gray-300 text-xs">• Pauză minimă: {INTRA_JN_CONFIG.minBreakDuration}min</p>
                <p className="text-gray-300 text-xs">• Pauză maximă: {INTRA_JN_CONFIG.maxBreakDuration}min</p>
              </div>

              <div className="p-4 bg-purple-500/20 rounded-xl text-sm">
                <p className="font-semibold mb-2 text-purple-400">💡 Cum să folosești Backup:</p>
                <ol className="text-gray-300 space-y-1 text-xs list-decimal list-inside">
                  <li>Exportă datele ÎNAINTE de update</li>
                  <li>Salvează fișierul JSON pe iCloud/WhatsApp</li>
                  <li>Instalează noua versiune a aplicației</li>
                  <li>Importă fișierul JSON salvat</li>
                  <li>Toate datele vor fi restaurate!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-8"></div>
      </div>
    );
  };

  return (
    <>
      {activeView === 'main' && <MainView />}
      {activeView === 'history' && <HistoryView />}
      {activeView === 'settings' && <SettingsView />}
    </>
  );
};

export default TimeTrackerApp;
