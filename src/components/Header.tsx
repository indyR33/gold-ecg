import React, { useEffect, useState } from 'react';
import { RefreshCw, Play, Pause, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  isLiveFeed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isSimulating,
  onToggleSimulate,
  onManualRefresh,
  isRefreshing,
  isLiveFeed,
}) => {
  const [parisTime, setParisTime] = useState('');
  const [nyTime, setNyTime] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setParisTime(
        now.toLocaleTimeString('fr-FR', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setNyTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Vue Globale' },
    { id: 'tracker', label: 'Cours Spot' },
    { id: 'sentiment', label: 'Analyseur RSS' },
    { id: 'simulator', label: 'Simulateur' },
    { id: 'macro', label: 'Indicateurs Macro' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
            <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('dashboard');
            }}
            className="text-xl font-bold tracking-tight text-white hover:text-amber-300 transition-colors"
          >
            GoldPulse
          </a>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Market clocks & actions */}
        <div className="flex items-center gap-3">
          {/* Market Clocks (Unboxed metadata with subtle separator) */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-slate-300 font-medium">Paris</span>
            <span className="text-slate-200 tabular-nums">{parisTime || '--:--:--'}</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-300 font-medium">NY</span>
            <span className="text-slate-200 tabular-nums">{nyTime || '--:--:--'}</span>
          </div>

          {/* Connection Status indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSimulating ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isSimulating ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="text-slate-300 font-mono text-[11px] uppercase tracking-wider">
              {isSimulating ? (isLiveFeed ? 'Flux Direct' : 'Simulation') : 'En Pause'}
            </span>
          </div>

          {/* Toggle Live Simulation Button */}
          <button
            onClick={onToggleSimulate}
            title={isSimulating ? 'Mettre la simulation en pause' : 'Démarrer la simulation continue'}
            aria-label={isSimulating ? 'Mettre en pause' : 'Démarrer'}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            title="Rafraîchir les flux RSS et le cours de l'or"
            aria-label="Rafraîchir les données"
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
