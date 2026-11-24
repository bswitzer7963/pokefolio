import { useMemo, useState } from 'react';

export type NodeKind = 'site' | 'job';

export interface WorkNode {
  id: string;
  label: string;
  kind: NodeKind;
  anchor: string; // element id to scroll to
  text: string; // searched for mentions of other nodes
  tech: string[];
}

const W = 380;
const H = 340;

// Tiny deterministic force layout: nodes repel, edges pull, everything drifts to the centre.
function layout(nodes: WorkNode[], edges: [number, number][]) {
  const pos = nodes.map((_, i) => {
    const a = (i / nodes.length) * Math.PI * 2;
    return { x: W / 2 + Math.cos(a) * 110, y: H / 2 + Math.sin(a) * 90 };
  });
  for (let step = 0; step < 400; step++) {
    const cool = 1 - step / 400;
    const force = pos.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const d2 = Math.max(dx * dx + dy * dy, 25);
        const f = 3200 / d2;
        const d = Math.sqrt(d2);
        force[i].x += (dx / d) * f; force[i].y += (dy / d) * f;
        force[j].x -= (dx / d) * f; force[j].y -= (dy / d) * f;
      }
    }
    for (const [a, b] of edges) {
      const dx = pos[b].x - pos[a].x;
      const dy = pos[b].y - pos[a].y;
      force[a].x += dx * 0.02; force[a].y += dy * 0.02;
      force[b].x -= dx * 0.02; force[b].y -= dy * 0.02;
    }
    pos.forEach((p, i) => {
      force[i].x += (W / 2 - p.x) * 0.01;
      force[i].y += (H / 2 - p.y) * 0.01;
      p.x = Math.min(W - 24, Math.max(24, p.x + force[i].x * cool));
      p.y = Math.min(H - 24, Math.max(24, p.y + force[i].y * cool));
    });
  }
  return pos;
}

const STOP = new Set(['through', 'without', 'across', 'because', 'between', 'within', 'during', 'should', 'another', 'project', 'projects']);

// Longer words, cut to a common stem so "disability" and "disabilities" match.
function keywords(text: string) {
  return new Set(
    text.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 6 && !STOP.has(w)).map((w) => w.slice(0, 7)),
  );
}

// Pairs that should never be linked, even if their text happens to overlap. Use the labels shown on the graph.
const NEVER_LINK: [string, string][] = [
  ['Data Lab', 'Almost Apex'],
];
const blocked = (a: string, b: string) =>
  NEVER_LINK.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

// Two pieces of work are linked when they share a tool, one names the other,
// or they talk about the same things (at least two shared key words).
function connect(nodes: WorkNode[]) {
  const words = nodes.map((n) => keywords(n.text));
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const sharesTool = a.tech.some((t) => b.tech.includes(t));
      const mentions = b.text.includes(a.label) || a.text.includes(b.label);
      let shared = 0;
      words[i].forEach((w) => { if (words[j].has(w)) shared++; });
      if ((sharesTool || mentions || shared >= 2) && !blocked(a.label, b.label)) edges.push([i, j]);
    }
  }
  return edges;
}

const KIND_NAME: Record<NodeKind, string> = { site: 'Project', job: 'Experience' };

export function WorkGraph({ nodes }: { nodes: WorkNode[] }) {
  const edges = useMemo(() => connect(nodes), [nodes]);
  const pos = useMemo(() => layout(nodes, edges), [nodes, edges]);
  const [active, setActive] = useState<number | null>(null);

  const linked = (i: number) => active !== null && (i === active || edges.some(([a, b]) => (a === active && b === i) || (b === active && a === i)));
  const go = (n: WorkNode) => document.getElementById(n.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <figure className="wg">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Network of my projects, sites and jobs">
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            className={active === null ? '' : active === a || active === b ? 'on' : 'off'}
            x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
          />
        ))}
        {nodes.map((n, i) => (
          <g
            key={n.id}
            className={`wg-node ${n.kind} ${active === null ? '' : linked(i) ? 'on' : 'off'}`}
            transform={`translate(${pos[i].x} ${pos[i].y})`}
            style={{ animationDelay: `${i * 45}ms` }}
            tabIndex={0}
            role="link"
            aria-label={`${n.label} (${KIND_NAME[n.kind]})`}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => go(n)}
            onKeyDown={(e) => { if (e.key === 'Enter') go(n); }}
          >
            <circle r={n.kind === 'site' ? 6.5 : 5.5} />
            <text y={-12} textAnchor="middle">{n.label.length > 18 ? `${n.label.slice(0, 16).trim()}…` : n.label}</text>
          </g>
        ))}
      </svg>
      <figcaption>
        <span className="wg-key site">Projects</span>
        <span className="wg-key job">Experience</span>
        <span className="wg-note">Linked when they share tools or topics. Select a point to jump to it.</span>
      </figcaption>
    </figure>
  );
}
