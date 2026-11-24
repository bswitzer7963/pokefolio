import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { projects } from '../data/portfolio';
import { useTransitionNav } from '../components/transitions';
import { audio } from '../lib/audio';

const tidy = (s: string) => s.replace(/ · /g, ', ');
const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

export default function ProjectPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const fromStatic = params.get('from') === 'static';
  const go = useTransitionNav();
  const p = projects.find((x) => x.id === id);

  // Coming from a battle, the victory music keeps playing.
  useEffect(() => { if (fromStatic) audio.stopMusic(); }, [fromStatic]);
  useEffect(() => { if (p) document.title = `${p.title} | Braden Switzer`; }, [p]);

  if (!p) {
    return (
      <div className="pf">
        <main className="pf-wrap pf-project">
          <h1>No project called “{id}”</h1>
          <p><Link to="/portfolio">See all projects</Link></p>
        </main>
      </div>
    );
  }

  return (
    <div className="pf">
      <main className="pf-wrap pf-project">
        <p className="pf-back"><Link to="/portfolio">Braden Switzer</Link></p>
        <h1>{p.title}</h1>
        <p className="pf-lede">{p.tagline}</p>
        <p className="pf-meta">{tidy(p.role)}, {p.year.endsWith('–') ? `${p.year}present` : p.year}. Built with {p.tech.join(', ')}.</p>
        {p.image && <img className="pf-shot" src={p.image} alt={`Screenshot of ${p.title}`} />}
        <div className="pf-body">
          {p.description.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <p className="pf-actions">
          {p.url && <a href={p.url} target="_blank" rel="noopener">Visit {host(p.url)}</a>}
          {p.repo && <a href={p.repo} target="_blank" rel="noopener">Source code</a>}
          {!fromStatic && (
            <>
              <button type="button" onClick={() => go(`/battle?r=${Date.now()}`, 'encounter')}>Battle again</button>
              <button type="button" onClick={() => { audio.stopMusic(); go('/', 'fadeBlack'); }}>Back to the title screen</button>
            </>
          )}
        </p>
      </main>
    </div>
  );
}
