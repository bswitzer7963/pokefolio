import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bag, contacts, liveSites, projects, site } from '../data/portfolio';
import { audio } from '../lib/audio';
import { WorkGraph, type WorkNode } from './WorkGraph';

const year = new Date().getFullYear();
const LINK_NAMES: Record<string, string> = { email: 'Email', github: 'GitHub', orcid: 'ORCID', linkedin: 'LinkedIn' };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const tidy = (s: string) => s.replace(/ · /g, ', ');
const when = (s?: string) => (s?.endsWith('–') ? `${s}present` : s);
const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
// "Monitor — New Visions at Onondaga Community College" -> "New Visions"
const orgName = (heading: string) => (heading.split(' — ')[1] ?? heading).split(/,| at /)[0];

const research = projects.filter((p) => p.featured);
const other = projects.filter((p) => !p.featured);
const sections = bag.map((p) => ({ ...p, items: p.items.filter((it) => it.href !== site.cv) }));
const experience = sections.find((s) => /experience/i.test(s.section));
const interests = bag.flatMap((p) => p.items).find((it) => /research interests/i.test(it.heading ?? ''));
// `intro` is optional in profile.ts; without it the subhead is used.
const intro = (site as { intro?: string }).intro ?? `${site.subhead.replace(' · ', '. ')}.`;

const nodes: WorkNode[] = [
  ...projects.map((p) => ({ id: p.id, label: p.title.replace(/ \(.*\)$/, ''), kind: 'site' as const, anchor: `p-${p.id}`, text: `${p.tagline} ${p.description}`, tech: p.tech })),
  ...liveSites.filter((s) => s.url).map((s) => ({ id: slug(s.title), label: s.title, kind: 'site' as const, anchor: `s-${slug(s.title)}`, text: s.description, tech: s.tech })),
  ...(experience?.items ?? []).map((it, i) => ({
    id: `job-${i}`, label: orgName(it.heading ?? it.name), kind: 'job' as const, anchor: `e-${i}`, text: `${it.heading} ${it.description}`, tech: [],
  })),
];

// The plain portfolio: same content as the game, written up like a normal personal site.
export default function StaticPortfolio() {
  useEffect(() => { audio.stopMusic(); document.title = 'Braden Switzer'; }, []);

  return (
    <div className="pf">
      <header className="pf-hero pf-wrap">
        <div className="pf-intro">
          <h1>Braden Switzer</h1>
          <p className="pf-lede">{intro}</p>
          {interests && <p className="pf-about">{interests.description}</p>}
          <nav className="pf-links" aria-label="Contact and profiles">
            {contacts.map((c) => (
              <a key={c.id} href={c.href} target={c.id === 'email' ? undefined : '_blank'} rel="noopener">{LINK_NAMES[c.id]}</a>
            ))}
            <a href={site.cv} target="_blank" rel="noopener">CV</a>
          </nav>
        </div>
        <WorkGraph nodes={nodes} />
      </header>

      <main className="pf-wrap">
        {research.length > 0 && (
          <section className="pf-sec" aria-labelledby="research-h">
            <h2 id="research-h">Research</h2>
            <div>
              {research.map((p) => (
                <article key={p.id} id={`p-${p.id}`} className="pf-feature">
                  <h3><Link to={`/project/${p.id}?from=static`}>{p.title}</Link></h3>
                  <p className="pf-tagline">{p.tagline}</p>
                  {p.description.split(/\n\s*\n/).slice(0, 2).map((para, i) => <p key={i}>{para}</p>)}
                  <p className="pf-meta">{tidy(p.role)}, {when(p.year)}. Built with {p.tech.join(', ')}.</p>
                  <p className="pf-actions">
                    {p.url && <a href={p.url} target="_blank" rel="noopener">{host(p.url)}</a>}
                    <Link to={`/project/${p.id}?from=static`}>Read more about {p.title}</Link>
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="pf-sec" aria-labelledby="projects-h">
          <h2 id="projects-h">Projects</h2>
          <div>
            {other.map((p) => (
              <article key={p.id} id={`p-${p.id}`} className="pf-row">
                <div>
                  <h3><Link to={`/project/${p.id}?from=static`}>{p.title}</Link></h3>
                  <p>{p.tagline}</p>
                  <p className="pf-meta">{tidy(p.role)}. Built with {p.tech.join(', ')}.</p>
                  {(p.url || p.repo) && (
                    <p className="pf-actions">
                      {p.url && <a href={p.url} target="_blank" rel="noopener">{host(p.url)}</a>}
                      {p.repo && <a href={p.repo} target="_blank" rel="noopener">Source code</a>}
                    </p>
                  )}
                </div>
                <span className="pf-when">{when(p.year)}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="pf-sec" aria-labelledby="sites-h">
          <h2 id="sites-h">More Projects</h2>
          <div>
            {liveSites.map((s) => (
              <article key={s.title} id={`s-${slug(s.title)}`} className="pf-row">
                <div>
                  <h3>{s.url ? <a href={s.url} target="_blank" rel="noopener">{s.title}</a> : s.title}</h3>
                  <p>{s.description}</p>
                  {s.tech.length > 0 && <p className="pf-meta">Built with {s.tech.join(', ')}.</p>}
                </div>
                <span className="pf-when">{s.year}</span>
              </article>
            ))}
          </div>
        </section>

        {sections
          .map((p) => ({ ...p, items: p.items.filter((it) => it !== interests) }))
          .filter((p) => p.items.length > 0)
          .map((pocket) => (
          <section key={pocket.id} className="pf-sec" aria-labelledby={`${pocket.id}-h`}>
            <h2 id={`${pocket.id}-h`}>{pocket.section}</h2>
            <div>
              {pocket.items.map((it, i) => (
                <article key={it.name} id={pocket.id === experience?.id ? `e-${i}` : undefined} className="pf-row">
                  <div>
                    <h3>{it.href ? <a href={it.href} target="_blank" rel="noopener">{it.heading ?? it.name}</a> : (it.heading ?? it.name)}</h3>
                    <p>{it.description}</p>
                  </div>
                  <span className="pf-when">{when(it.qty)}</span>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="pf-foot pf-wrap">
        <p>© {year} Braden Switzer</p>
        <p>
          <a href={site.repo} target="_blank" rel="noopener">Source code</a>
          <Link to="/">Interactive version</Link>
        </p>
      </footer>
    </div>
  );
}
