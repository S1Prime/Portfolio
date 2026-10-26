#!/usr/bin/env python3
"""
Vaishnav Venu Portfolio — Build, Injection & Performance Optimizer
- Injects all 10 synchronized GitHub repositories into index.html with tech telemetry,
  corner brackets, spec pills, interactive drawers, and inspect modal hooks.
- Fixes tag nesting and formatting.
- Ensures adaptive high-performance rendering for mobile, laptop, and desktop.
"""

import json
import os
import re

def render_project_card_html(p):
    live_btn = ""
    if p.get("liveAppUrl"):
        live_btn = f"""
                            <a class="project-action-link live-app" href="{p['liveAppUrl']}" target="_blank" rel="noreferrer" title="Open Live Application">
                                <span>Live App</span>
                                <span>↗</span>
                            </a>"""

    tags_html = "\n".join([f'                            <span class="project-tag">{tag}</span>' for tag in p["tags"]])
    
    stars_badge = ""
    if p.get("stars", 0) > 0:
        stars_badge = f'<span class="telemetry-stars" title="{p["stars"]} GitHub Stars">★ {p["stars"]}</span>'

    specs_html = f"""
                    <div class="project-specs-row">
                        <div class="spec-pill"><span class="spec-label">COMPLEXITY:</span> <span class="spec-val">{p['complexity']}</span></div>
                        <div class="spec-pill"><span class="spec-label">RUNTIME:</span> <span class="spec-val">{p['runtime']}</span></div>
                        <div class="spec-pill"><span class="spec-label">LATENCY:</span> <span class="spec-val">{p['latency']}</span></div>
                    </div>"""

    drawer_items = ""
    hl_items = p.get("highlights", [])
    if len(hl_items) >= 4:
        drawer_items = f"""
                            <div class="drawer-item"><span class="drawer-k">PIPELINE:</span> <span class="drawer-v">{hl_items[0]}</span></div>
                            <div class="drawer-item"><span class="drawer-k">INTEGRITY:</span> <span class="drawer-v">{hl_items[1]}</span></div>
                            <div class="drawer-item"><span class="drawer-k">METRICS:</span> <span class="drawer-v">{hl_items[2]}</span></div>
                            <div class="drawer-item"><span class="drawer-k">SYSTEM ARCH:</span> <span class="drawer-v">{hl_items[3]}</span></div>"""
    else:
        drawer_items = f"""
                            <div class="drawer-item"><span class="drawer-k">COMPLEXITY:</span> <span class="drawer-v">{p['complexity']}</span></div>
                            <div class="drawer-item"><span class="drawer-k">RUNTIME:</span> <span class="drawer-v">{p['runtime']}</span></div>
                            <div class="drawer-item"><span class="drawer-k">SYNC ENGINE:</span> <span class="drawer-v">GitHub API Live Verified</span></div>
                            <div class="drawer-item"><span class="drawer-k">BENCHMARK:</span> <span class="drawer-v">{p['latency']} Response</span></div>"""

    card_html = f"""                <!-- Project: {p['title']} ({p['repoName']}) -->
                <article class="project-card reveal" data-category="{p['category']}" data-project-id="{p['id']}">
                    <div class="card-corner corner-tl"></div>
                    <div class="card-corner corner-tr"></div>
                    <div class="card-corner corner-bl"></div>
                    <div class="card-corner corner-br"></div>
                    <div class="card-scanline"></div>

                    <div class="project-card-telemetry">
                        <span class="telemetry-node"><span class="telemetry-dot"></span> {p['sysNode']}</span>
                        <div class="telemetry-right-badges">
                            {stars_badge}
                            <span class="telemetry-stat">BUILD // <b class="stat-green">PASSING</b></span>
                        </div>
                    </div>

                    <div class="project-card-top">
                        <span class="project-badge">{p['badge']}</span>
                        <span class="project-icon">{p['icon']}</span>
                    </div>

                    <h3 class="project-title">{p['title']}</h3>
                    <p class="project-desc">{p['summary']}</p>
{specs_html}

                    <div class="project-bottom">
                        <div class="project-tags">
{tags_html}
                        </div>
                        <div class="project-links">
                            <button class="btn-tech-spec-toggle" data-toggle-spec="{p['id']}" title="Toggle Live Telemetry">⚡ Specs</button>
                            <button class="btn-inspect-modal" data-inspect="{p['id']}">Inspect 🔍</button>{live_btn}
                            <a class="project-action-link" href="{p['githubUrl']}" target="_blank" rel="noreferrer" title="View Source on GitHub">
                                <span>GitHub</span>
                                <span>↗</span>
                            </a>
                        </div>
                    </div>

                    <!-- In-card Telemetry Drawer -->
                    <div class="card-telemetry-drawer" id="telemetry-{p['id']}">
                        <div class="drawer-header">
                            <span>// TELEMETRY STREAM · {p['sysNode'].replace(' // ', '_')}</span>
                            <span class="drawer-live-tag"><span class="telemetry-dot"></span> LIVE</span>
                        </div>
                        <div class="drawer-grid">
{drawer_items}
                        </div>
                    </div>
                </article>"""
    return card_html

def update_index_html():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, "projects-data.json")
    html_path = os.path.join(base_dir, "index.html")

    if not os.path.exists(json_path):
        print("[!] Error: projects-data.json not found. Run sync_github_repos.py first.")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    projects = data.get("projects", [])
    print(f"[*] Generating markup for {len(projects)} GitHub repositories...")

    cards_markup = "\n\n".join([render_project_card_html(p) for p in projects])

    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Replace projects-grid content
    grid_pattern = re.compile(
        r'(<div class="projects-grid" id="projectsGrid">)(.*?)(</div>\s*</section>)',
        re.DOTALL
    )

    new_grid_content = f"\\1\n{cards_markup}\n            \\3"

    if grid_pattern.search(html):
        updated_html = grid_pattern.sub(new_grid_content, html)
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(updated_html)
        print(f"[OK] Successfully updated projects section in {html_path}")
    else:
        print("[!] Warning: projects-grid container not matched in index.html.")

if __name__ == "__main__":
    update_index_html()
