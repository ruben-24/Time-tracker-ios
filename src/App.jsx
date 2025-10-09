import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, StopCircle, History, Settings, MapPin, TrendingUp, ArrowLeft, Edit2, Check, X } from 'lucide-react';

const DEFAULT_LOCATION_1 = "Wasserburger Str. 15a, 83119 Obing";
const DEFAULT_LOCATION_2 = "Adresa personalizată";

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

  const getCurrentLocation = () => activeLocation === 1 ? DEFAULT_LOCATION_1 : location2Custom;
  const getLocationKey = () => activeLocation === 1 ? 'location1' : 'location2';

  useEffect(() => {
    const savedData = localStorage.getItem('workTimeDataDual');
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
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      workRecords,
      location2Custom,
      activeLocation,
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
    localStorage.setItem('workTimeDataDual', JSON.stringify(data));
  }, [isAtWork, isPaused, startTime, pauseStartTime, totalPauseTime, pauseHistory, workRecords, activeLocation, location2Custom]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const formatExactTime = (date) => {
    return new Date(date).toLocaleTimeString('ro-RO', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

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
  };

  const pauseWork = () => {
    setIsPaused(true);
    const now = new Date();
    setPauseStartTime(now);
    setPauseHistory([...pauseHistory, {
      start: now.toISOString(),
      startFormatted: formatExactTime(now)
    }]);
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
      location: getCurrentLocation()
    };
    
    const locationKey = getLocationKey();
    setWorkRecords({
      ...workRecords,
      [locationKey]: [...workRecords[locationKey], record]
    });
    
    setIsAtWork(false);
    setIsPaused(false);
    setStartTime(null);
    setPauseStartTime(null);
    setTotalPauseTime(0);
    setPauseHistory([]);
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

  const MainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Safe area top for iPhone notch/Dynamic Island */}
      <div className="h-16"></div>
      
      <div className="px-6 pb-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">TIME TRACKER</h1>
            </div>
          </div>

          {/* Location Switcher */}
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

          {/* Status Display */}
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
                    <span className="text-gray-400">⏰ Lucrat:</span>
                    <span className="font-semibold">{formatDuration(getCurrentSessionTime())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">☕ Pauză curentă:</span>
                    <span className="font-semibold">{formatDuration(Math.floor((currentTime - pauseStartTime) / 1000))}</span>
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

          {/* Action Buttons */}
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

          {/* Navigation Buttons */}
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

          {/* Current Time */}
          <div className="text-center text-sm text-gray-400">
            {currentTime.toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <br />
            {currentTime.toLocaleTimeString('ro-RO')}
          </div>
        </div>
      </div>
      
      {/* Safe area bottom for iPhone home indicator */}
      <div className="h-8"></div>
    </div>
  );

  const HistoryView = () => {
    const currentRecords = workRecords[getLocationKey()] || [];
    const sortedRecords = [...currentRecords].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="h-16"></div>
        
        <div className="px-6 pb-10">
          <div className="max-w-md mx-auto">
            {/* Back Button - moved lower */}
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

            <div className="space-y-4">
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

            <div className="mt-8 space-y-4">
              <div className="p-4 bg-white/5 rounded-xl text-sm">
                <p className="font-semibold mb-3 text-blue-400">ℹ️ Informații Generale:</p>
                <p className="text-gray-300">• Status: {isAtWork ? (isPaused ? 'În pauză' : 'Activ') : 'Inactiv'}</p>
                <p className="text-gray-300">• Locație activă: {activeLocation === 1 ? 'Locație 1' : 'Locație 2'}</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl text-sm">
                <p className="font-semibold mb-3 text-green-400">📊 Statistici pe Locații:</p>
                <p className="text-gray-300">• Locație 1: {loc1Count} sesiuni</p>
                <p className="text-gray-300 text-xs ml-4 mt-1">{DEFAULT_LOCATION_1}</p>
                <p className="text-gray-300 mt-2">• Locație 2: {loc2Count} sesiuni</p>
                <p className="text-gray-300 text-xs ml-4 mt-1">{location2Custom}</p>
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
