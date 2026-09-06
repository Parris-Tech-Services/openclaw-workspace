import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';

const REGIONS = [
  {
    id: 'verdant-wood',
    name: 'Verdant Wood',
    shortName: 'Forest',
    subtitle: 'Ancient trees, hidden paths, and quiet lights.',
    icon: '🌲',
    tone: 'emerald',
    x: 18,
    y: 32,
    threat: 'Low mist, strange tracks',
    locations: [
      {
        id: 'oakwatch',
        name: 'Oakwatch Hollow',
        icon: '🛖',
        x: 26,
        y: 42,
        type: 'Village',
        sceneTitle: 'The Lantern Under the Roots',
        sceneText:
          'A warm lantern glows beneath the roots of a giant oak. The soil has been freshly disturbed, and a tiny brass compass hums when you step closer.',
        actionLabel: 'Take the brass compass',
        item: 'Brass Root Compass',
        clue: 'The compass needle points toward the mountain even when turned upside down.',
      },
      {
        id: 'mossgate',
        name: 'Mossgate Ruins',
        icon: '🪨',
        x: 63,
        y: 24,
        type: 'Ruin',
        sceneTitle: 'The Door With No Hinges',
        sceneText:
          'Green stones form a doorway standing alone in the moss. Symbols brighten when you touch the lowest stone.',
        actionLabel: 'Trace the glowing symbol',
        item: 'Mossgate Rubbing',
        clue: 'The symbol matches the same spiral carved into old desert glass.',
      },
      {
        id: 'silverbrook',
        name: 'Silverbrook Crossing',
        icon: '💧',
        x: 48,
        y: 70,
        type: 'Crossing',
        sceneTitle: 'The Whispering Current',
        sceneText:
          'The brook runs clear, but your reflection looks one second behind you. A silver scale catches on a reed.',
        actionLabel: 'Collect the silver scale',
        item: 'Silverbrook Scale',
        clue: 'Something large crossed here last night, travelling against the current.',
      },
    ],
  },
  {
    id: 'frostspine',
    name: 'Frostspine Peaks',
    shortName: 'Mountain',
    subtitle: 'Thin air, old watchtowers, and blue fire in the snow.',
    icon: '⛰️',
    tone: 'sapphire',
    x: 56,
    y: 18,
    threat: 'Avalanche winds, signal fires',
    locations: [
      {
        id: 'stonehold',
        name: 'Stonehold',
        icon: '🏰',
        x: 35,
        y: 36,
        type: 'Fortress',
        sceneTitle: 'The Cold Bell Tower',
        sceneText:
          'A bronze bell hangs silent above the keep. Frost covers only one side of it, forming the outline of a hand.',
        actionLabel: 'Ring the frost-marked bell',
        item: 'Bell Echo Shard',
        clue: 'The echo answers from the desert, not from the valley below.',
      },
      {
        id: 'skylift',
        name: 'Skylift Pass',
        icon: '🪢',
        x: 62,
        y: 58,
        type: 'Pass',
        sceneTitle: 'The Broken Lift',
        sceneText:
          'A rope platform swings above a frozen gorge. Someone has cut the west rope cleanly with a heated blade.',
        actionLabel: 'Recover the cut rope fibres',
        item: 'Scorched Rope Fibres',
        clue: 'The burn pattern suggests glass-fire, a desert technique.',
      },
      {
        id: 'starcairn',
        name: 'Star Cairn',
        icon: '✨',
        x: 72,
        y: 24,
        type: 'Cairn',
        sceneTitle: 'The Map of Winter Stars',
        sceneText:
          'Flat stones form a star map. One stone is warm despite the snow piling around it.',
        actionLabel: 'Turn the warm star stone',
        item: 'Warm Star Stone',
        clue: 'When turned, it reveals three marks: root, bell, glass.',
      },
    ],
  },
  {
    id: 'sunscar',
    name: 'Sunscar Expanse',
    shortName: 'Desert',
    subtitle: 'Glass dunes, buried gates, and heat that remembers.',
    icon: '🏜️',
    tone: 'amber',
    x: 72,
    y: 68,
    threat: 'Mirages, glass storms',
    locations: [
      {
        id: 'emberwell',
        name: 'Emberwell',
        icon: '🔥',
        x: 30,
        y: 62,
        type: 'Settlement',
        sceneTitle: 'The Well That Smokes',
        sceneText:
          'The village well exhales warm smoke. At the bottom, something metallic reflects the sun even in shadow.',
        actionLabel: 'Lower the hook into the well',
        item: 'Sunken Copper Key',
        clue: 'The key teeth match the hinge-less gate in the forest ruins.',
      },
      {
        id: 'glassfield',
        name: 'Glassfield Dunes',
        icon: '🔶',
        x: 58,
        y: 38,
        type: 'Dunes',
        sceneTitle: 'The Singing Glass',
        sceneText:
          'Thin glass sheets ripple across the dunes. Each step rings a note, and three notes repeat under the wind.',
        actionLabel: 'Record the three-note pattern',
        item: 'Glassfield Tune',
        clue: 'The tune matches the rhythm of the cold bell in Stonehold.',
      },
      {
        id: 'drywells',
        name: 'Dry Wells',
        icon: '🕳️',
        x: 76,
        y: 72,
        type: 'Outpost',
        sceneTitle: 'The Buried Survey Post',
        sceneText:
          'Half-buried survey markers point in impossible directions. One marker is labelled with your current date.',
        actionLabel: 'Pull up the dated marker',
        item: 'Impossible Survey Marker',
        clue: 'The marker lists all three regions as parts of one buried machine.',
      },
    ],
  },
];

function App() {
  const [layer, setLayer] = useState('world');
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [discovered, setDiscovered] = useState({});
  const [worldPan, setWorldPan] = useState({ x: 0, y: 0 });
  const [worldZoom, setWorldZoom] = useState(1);
  const [log, setLog] = useState([
    'Welcome, cartographer. Choose a region, then zoom into a location to uncover clues.',
  ]);

  const selectedRegion = useMemo(
    () => REGIONS.find((region) => region.id === selectedRegionId) ?? null,
    [selectedRegionId]
  );

  const selectedLocation = useMemo(
    () => selectedRegion?.locations.find((location) => location.id === selectedLocationId) ?? null,
    [selectedLocationId, selectedRegion]
  );

  const totalDiscoveries = REGIONS.reduce((sum, region) => sum + region.locations.length, 0);
  const foundCount = Object.keys(discovered).length;

  function addLog(message) {
    setLog((current) => [message, ...current].slice(0, 5));
  }

  function enterRegion(regionId) {
    const region = REGIONS.find((candidate) => candidate.id === regionId);
    setSelectedRegionId(regionId);
    setSelectedLocationId(null);
    setLayer('region');
    addLog(`Zoomed into ${region.name}. Choose a location to inspect.`);
  }

  function enterLocation(locationId) {
    const location = selectedRegion.locations.find((candidate) => candidate.id === locationId);
    setSelectedLocationId(locationId);
    setLayer('detail');
    addLog(`Entered ${location.name}. Look for an interaction in the scene.`);
  }

  function goWorld() {
    setLayer('world');
    setSelectedRegionId(null);
    setSelectedLocationId(null);
    addLog('Returned to the world map.');
  }

  function goRegion() {
    if (!selectedRegion) {
      goWorld();
      return;
    }
    setLayer('region');
    setSelectedLocationId(null);
    addLog(`Returned to ${selectedRegion.name}.`);
  }

  function interactWithScene() {
    if (!selectedLocation) return;

    if (discovered[selectedLocation.id]) {
      addLog(`You already resolved ${selectedLocation.name}.`);
      return;
    }

    setDiscovered((current) => ({
      ...current,
      [selectedLocation.id]: selectedLocation.clue,
    }));
    setInventory((current) => [...current, selectedLocation.item]);
    addLog(`Found ${selectedLocation.item}: ${selectedLocation.clue}`);
  }

  function resetGame() {
    setLayer('world');
    setSelectedRegionId(null);
    setSelectedLocationId(null);
    setInventory([]);
    setDiscovered({});
    setWorldPan({ x: 0, y: 0 });
    setWorldZoom(1);
    setLog(['Reset complete. Start again from the world map.']);
  }

  function pan(dx, dy) {
    setWorldPan((current) => ({ x: current.x + dx, y: current.y + dy }));
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Playable React Prototype</p>
          <h1>Multi-Layer Zoom Game</h1>
          <p className="hero-copy">
            Explore a living map by moving from world view, to region view, to close-up scene encounters.
          </p>
        </div>
        <div className="status-card">
          <span className="status-label">Current layer</span>
          <strong>{layerLabel(layer)}</strong>
          <span>{foundCount} / {totalDiscoveries} discoveries</span>
        </div>
      </section>

      <section className="layout-grid">
        <aside className="side-panel">
          <Breadcrumbs
            layer={layer}
            selectedRegion={selectedRegion}
            selectedLocation={selectedLocation}
            onWorld={goWorld}
            onRegion={goRegion}
          />

          <div className="panel-block">
            <h2>How to play</h2>
            <p>{helpText(layer)}</p>
          </div>

          <div className="panel-block">
            <h2>Inventory</h2>
            {inventory.length === 0 ? (
              <p className="muted">No items yet. Zoom into a scene and interact with it.</p>
            ) : (
              <ul className="compact-list">
                {inventory.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </div>

          <div className="panel-block">
            <h2>Recent log</h2>
            <ul className="event-log">
              {log.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
            </ul>
          </div>

          <button className="ghost-button full-width" onClick={resetGame}>Reset prototype</button>
        </aside>

        <section className={`game-stage stage-${layer}`}>
          {layer === 'world' && (
            <WorldLayer
              regions={REGIONS}
              onEnterRegion={enterRegion}
              pan={worldPan}
              zoom={worldZoom}
              onPan={pan}
              onZoom={setWorldZoom}
              onCentre={() => {
                setWorldPan({ x: 0, y: 0 });
                setWorldZoom(1);
              }}
            />
          )}

          {layer === 'region' && selectedRegion && (
            <RegionLayer
              region={selectedRegion}
              discovered={discovered}
              onEnterLocation={enterLocation}
              onBack={goWorld}
            />
          )}

          {layer === 'detail' && selectedRegion && selectedLocation && (
            <DetailLayer
              region={selectedRegion}
              location={selectedLocation}
              resolved={Boolean(discovered[selectedLocation.id])}
              clue={discovered[selectedLocation.id]}
              onInteract={interactWithScene}
              onBack={goRegion}
            />
          )}
        </section>
      </section>
    </main>
  );
}

function Breadcrumbs({ layer, selectedRegion, selectedLocation, onWorld, onRegion }) {
  return (
    <nav className="breadcrumbs" aria-label="Map breadcrumbs">
      <button onClick={onWorld}>World</button>
      {selectedRegion && (
        <>
          <span>›</span>
          <button onClick={onRegion} disabled={layer === 'region'}>{selectedRegion.shortName}</button>
        </>
      )}
      {selectedLocation && (
        <>
          <span>›</span>
          <button disabled>{selectedLocation.name}</button>
        </>
      )}
    </nav>
  );
}

function WorldLayer({ regions, onEnterRegion, pan, zoom, onPan, onZoom, onCentre }) {
  return (
    <div className="stage-card">
      <div className="stage-header">
        <div>
          <p className="eyebrow">Layer 1</p>
          <h2>World Map</h2>
          <p>Select a region. Use the controls to pan and zoom the map.</p>
        </div>
        <div className="map-controls">
          <button onClick={() => onPan(0, -20)}>↑</button>
          <button onClick={() => onPan(-20, 0)}>←</button>
          <button onClick={onCentre}>Centre</button>
          <button onClick={() => onPan(20, 0)}>→</button>
          <button onClick={() => onPan(0, 20)}>↓</button>
          <button onClick={() => onZoom(Math.max(0.8, Number((zoom - 0.1).toFixed(1))))}>−</button>
          <button onClick={() => onZoom(Math.min(1.4, Number((zoom + 0.1).toFixed(1))))}>+</button>
        </div>
      </div>

      <div className="world-viewport">
        <div className="world-map" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          <div className="route route-one" />
          <div className="route route-two" />
          {regions.map((region) => (
            <button
              className={`region-node tone-${region.tone}`}
              key={region.id}
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              onClick={() => onEnterRegion(region.id)}
            >
              <span className="node-icon">{region.icon}</span>
              <strong>{region.name}</strong>
              <small>{region.threat}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegionLayer({ region, discovered, onEnterLocation, onBack }) {
  return (
    <div className="stage-card">
      <div className="stage-header">
        <div>
          <p className="eyebrow">Layer 2</p>
          <h2>{region.icon} {region.name}</h2>
          <p>{region.subtitle}</p>
        </div>
        <button className="ghost-button" onClick={onBack}>Zoom out to World</button>
      </div>

      <div className={`region-map tone-${region.tone}`}>
        {region.locations.map((location) => (
          <button
            className={`location-node ${discovered[location.id] ? 'resolved' : ''}`}
            key={location.id}
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onClick={() => onEnterLocation(location.id)}
          >
            <span>{location.icon}</span>
            <strong>{location.name}</strong>
            <small>{location.type}</small>
            {discovered[location.id] && <em>Resolved</em>}
          </button>
        ))}
      </div>

      <div className="location-list">
        {region.locations.map((location) => (
          <button key={location.id} onClick={() => onEnterLocation(location.id)}>
            <span>{location.icon}</span>
            <div>
              <strong>{location.name}</strong>
              <small>{discovered[location.id] ? discovered[location.id] : 'Unexplored scene'}</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailLayer({ region, location, resolved, clue, onInteract, onBack }) {
  return (
    <div className="stage-card detail-card">
      <div className="stage-header">
        <div>
          <p className="eyebrow">Layer 3 · {region.shortName} detail</p>
          <h2>{location.icon} {location.sceneTitle}</h2>
          <p>{location.name}</p>
        </div>
        <button className="ghost-button" onClick={onBack}>Zoom out to Region</button>
      </div>

      <div className={`scene-panel tone-${region.tone}`}>
        <div className="scene-art">
          <div className="pulse-orb" />
          <span>{location.icon}</span>
        </div>
        <div className="scene-copy">
          <p>{location.sceneText}</p>
          {resolved ? (
            <div className="clue-card">
              <strong>Discovery recorded</strong>
              <p>{clue}</p>
            </div>
          ) : (
            <button className="primary-button" onClick={onInteract}>{location.actionLabel}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function layerLabel(layer) {
  if (layer === 'world') return 'World';
  if (layer === 'region') return 'Region';
  return 'Detail scene';
}

function helpText(layer) {
  if (layer === 'world') {
    return 'Click a large region node to zoom in. Pan and zoom are included to give the world map a proper map-table feel.';
  }
  if (layer === 'region') {
    return 'Click a location node or card to enter a close-up scene. Resolved locations stay marked.';
  }
  return 'Read the scene, use the action button, then return to the region. Your item and clue are saved in the side panel.';
}

createRoot(document.getElementById('root')).render(<App />);
