import { useEffect, useMemo, useState } from 'react';
import Admin from './Admin';
import MapOverlay from './components/MapOverlay';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const festivalDates = [
  { id: 'Panchami', label: '15 Panchami', date: new Date('2026-10-15T00:00:00') },
  { id: 'Sasthi', label: '16 Sasthi', date: new Date('2026-10-16T00:00:00') },
  { id: 'Saptami', label: '17 Saptami', date: new Date('2026-10-17T00:00:00') },
  { id: 'Saptami2', label: '18 Saptami', date: new Date('2026-10-18T00:00:00') },
  { id: 'Ashtami', label: '19 Ashtami', date: new Date('2026-10-19T00:00:00') },
  { id: 'Navami', label: '20 Navami', date: new Date('2026-10-20T00:00:00') },
  { id: 'Dashami', label: '21 Dashami', date: new Date('2026-10-21T00:00:00') },
];

function formatCountdown(ms) {
  if (ms <= 0) return 'Live';
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
}

function App() {
  const [mapOpen, setMapOpen] = useState(false);
  const [pandals, setPandals] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const fetchData = async () => {
    try {
      const [pandalsResponse, progressResponse] = await Promise.all([
        fetch(`${API_URL}/pandals`),
        fetch(`${API_URL}/progress`),
      ]);

      const pandalsData = await pandalsResponse.json();
      const progressData = await progressResponse.json();

      const progressObject = {};
      progressData.forEach((item) => {
        progressObject[item.pandalId] = {
          visited: item.visited,
          note: item.note || '',
        };
      });

      setPandals(pandalsData);
      setProgressMap(progressObject);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const zones = useMemo(() => {
    return [
      ...new Set(
        pandals.map(
          (pandal) => pandal.zone?.name || 'Uncategorised'
        )
      ),
    ].sort();
  }, [pandals]);

  const groupedPandals = useMemo(() => {
  const filtered = pandals.filter((pandal) => {
    const matchesSearch = pandal.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const visited = Boolean(
      progressMap[pandal._id]?.visited
    );

    const matchesFilter =
      filter === 'all' ||
      (filter === 'visited' && visited) ||
      (filter === 'pending' && !visited);

    const zoneName =
      pandal.zone?.name || 'Uncategorised';

    const matchesZone =
      zoneFilter === 'all' ||
      zoneName === zoneFilter;

    return (
      matchesSearch &&
      matchesFilter &&
      matchesZone
    );
  });

  return filtered.reduce((acc, pandal) => {
    const zoneName =
      pandal.zone?.name || 'Uncategorised';

    if (!acc[zoneName]) {
      acc[zoneName] = [];
    }

    acc[zoneName].push(pandal);

    return acc;
  }, {});
}, [
  pandals,
  progressMap,
  search,
  filter,
  zoneFilter,
]);
  const totalCount = pandals.length;
  const visitedCount = pandals.filter((pandal) => Boolean(progressMap[pandal._id]?.visited)).length;
  const percent = totalCount ? Math.round((visitedCount / totalCount) * 100) : 0;

  const toggleVisited = async (pandalId, checked) => {
    try {
      const response = await fetch(`${API_URL}/progress/${pandalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visited: checked,
          note: progressMap[pandalId]?.note || '',
        }),
      });

      const updated = await response.json();

      setProgressMap((prev) => ({
        ...prev,
        [pandalId]: {
          visited: updated.visited,
          note: updated.note || '',
        },
      }));
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const updateNote = async (pandalId, value) => {
    try {
      const response = await fetch(`${API_URL}/progress/${pandalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visited: Boolean(progressMap[pandalId]?.visited),
          note: value,
        }),
      });

      const updated = await response.json();
      setProgressMap((prev) => ({
        ...prev,
        [pandalId]: {
          visited: updated.visited,
          note: updated.note || '',
        },
      }));
    } catch (error) {
      console.error('Note update error:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading pandals...</div>;
  }

  return (
    <>
      <header>
        <h1>🪔 Durga Puja 2026</h1>
        <h2>Pandal Tracker</h2>
        <p>Your personal pandal-hopping checklist</p>
        <div className="countdowns">
          {festivalDates.map(({ id, label, date }) => (
            <div className="countdown-box" key={id}>
              {label}
              <b id={`cd${id}`}>{formatCountdown(date - now)}</b>
            </div>
          ))}
        </div>
      </header>

      <div className="progress-wrap">
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${percent}%` }}>
            {percent > 8 ? `${percent}%` : ''}
          </div>
        </div>
        <div className="progress-label">
          {visitedCount} / {totalCount} pandals visited
        </div>
      </div>

      <div className="controls">
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search pandal..."
        />
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'visited' ? 'active' : ''}`}
          onClick={() => setFilter('visited')}
        >
          ✓ Visited
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          ⊕ Pending
        </button>
        <select
          className="zone-filter"
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          aria-label="Filter by zone"
        >
          <option value="all">All Zones</option>
        
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      <main>
        {Object.entries(groupedPandals).map(([zone, zonePandals]) => (
          <details key={zone} className="zone" open>
            <summary>
              <span>{zone}</span>
              <span className="zone-count">
                {(() => {
                  const allZonePandals = pandals.filter(
                    (pandal) =>
                      (pandal.zone?.name || 'Uncategorised') === zone
                  );
              
                  const visitedZonePandals =
                    allZonePandals.filter((pandal) =>
                      Boolean(
                        progressMap[pandal._id]?.visited
                      )
                    );
              
                  return `${visitedZonePandals.length}/${allZonePandals.length}`;
                })()}
              </span>
            </summary>
            <div className="zone-body">
              {zonePandals.map((pandal) => {
                const itemProgress = progressMap[pandal._id] || { visited: false, note: '' };
                const isChecked = Boolean(itemProgress.visited);

                return (
                  <div key={pandal._id} className={`pandal-row ${isChecked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => toggleVisited(pandal._id, e.target.checked)}
                    />
                    <div className="pandal-info">
                      <span className="pandal-name">{pandal.name}</span>
                      {pandal.uncertain ? <span className="uncertain-tag">⚠ verify</span> : null}
                      <span
                        className="note-toggle"
                        onClick={() => {
                          const input = document.querySelector(`.note-input[data-id='${pandal._id}']`);
                          if (input) {
                            input.style.display = input.style.display === 'block' ? 'none' : 'block';
                          }
                        }}
                      >
                        📝 note
                      </span>
                      <input
                        type="text"
                        data-id={pandal._id}
                        className="note-input"
                        value={itemProgress.note}
                        placeholder="Add a note..."
                        onChange={(e) => updateNote(pandal._id, e.target.value)}
                        style={{ display: itemProgress.note ? 'block' : 'none' }}
                      />
                     {pandal.maps ? (
                        <a
                          className="maps-btn"
                          href={pandal.maps}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📍 Maps
                        </a>
                      ) : pandal.latitude != null && pandal.longitude != null ? (
                        <span className="maps-btn">
                          📍 Location available
                        </span>
                      ) : (
                        <span className="maps-btn maps-missing">
                          📍 No location
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </main>
      
      <button
      className="floating-map-button"
      onClick={() => setMapOpen(true)}
      aria-label="Open pandal map"
    >
      <span className="map-icon">
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="22" />
          <path d="M16 34L29 13L32 27L16 34Z" />
        </svg>
      </span>
    
      <span>Map</span>
    </button>
        
        {mapOpen && (
          <MapOverlay
            pandals={pandals}
            progressMap={progressMap}
            onToggleVisited={toggleVisited}
            onClose={() => setMapOpen(false)}
          />
        )}
      
      <footer>📍 Progress saved automatically • MongoDB-backed</footer>
    </>
  );
}

const RootApp = () => {
  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  return <App />;
};

export default RootApp;

