import React, { useEffect, useRef, memo } from 'react';
import { Currency } from '../types';

interface GoldApiTradingViewWidgetProps {
  currency: Currency;
  height?: number | string;
}

// Map currency to standard GoldAPI.io / TradingView institutional symbol
const SYMBOL_MAP: Record<Currency, string> = {
  USD: 'FOREXCOM:XAUUSD',
  EUR: 'FOREXCOM:XAUEUR',
  GBP: 'FOREXCOM:XAUGBP',
  CHF: 'FOREXCOM:XAUCHF',
};

export const GoldApiTradingViewWidget: React.FC<GoldApiTradingViewWidgetProps> = memo(({
  currency,
  height = 420,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const symbol = SYMBOL_MAP[currency] || 'FOREXCOM:XAUUSD';
  const currentSymbolRef = useRef<string>('');

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // Prevent rebuilding the widget if already rendered for the same symbol
    if (currentSymbolRef.current === symbol && currentContainer.childNodes.length > 0) {
      return;
    }
    currentSymbolRef.current = symbol;

    // Clean previous widget contents safely
    currentContainer.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tradingview-widget-container';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.height = '100%';
    wrapper.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        [
          `Or Spot ${currency} (GoldAPI.io · FOREX.com)`,
          symbol
        ]
      ],
      chartOnly: false,
      width: '100%',
      height: '100%',
      locale: 'fr',
      colorTheme: 'dark',
      autosize: true,
      showVolume: true,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '11',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: 'area',
      headerFontSize: 'medium',
      backgroundColor: 'rgba(2, 6, 23, 0.98)',
      gridLineColor: 'rgba(30, 41, 59, 0.4)',
      lineColor: '#f59e0b',
      topColor: 'rgba(245, 158, 11, 0.45)',
      bottomColor: 'rgba(245, 158, 11, 0.02)',
      upColor: '#10b981',
      downColor: '#ef4444',
    });

    wrapper.appendChild(script);
    currentContainer.appendChild(wrapper);

    return () => {
      // Delay wiping container slightly to avoid breaking active iframe postMessage handlers
      const containerToClean = currentContainer;
      currentSymbolRef.current = '';
      setTimeout(() => {
        if (containerToClean && currentSymbolRef.current !== symbol) {
          containerToClean.innerHTML = '';
        }
      }, 150);
    };
  }, [symbol, currency]);

  return (
    <div
      ref={containerRef}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      className="w-full h-full rounded-xl overflow-hidden bg-slate-950"
    />
  );
});

GoldApiTradingViewWidget.displayName = 'GoldApiTradingViewWidget';
