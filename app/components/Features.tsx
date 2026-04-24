const FEATURES = [
  {
    title: "Code Snippets",
    description: "Store reusable code with syntax highlighting. Search by language, tag, or content.",
    color: "#3b82f6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M16 18l2-2-2-2M8 6l-2 2 2 2M21 12H3" />
      </svg>
    ),
  },
  {
    title: "AI Prompts",
    description: "Save your best AI prompts. Optimize them with AI and track which ones work best.",
    color: "#f59e0b",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Instant Search",
    description: "Find anything in milliseconds. Search across content, tags, titles, and types.",
    color: "#06b6d4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    title: "Commands",
    description: "Store terminal commands with descriptions. Never forget that tricky one-liner again.",
    color: "#22c55e",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M4 17l6-6-6-6M12 19h8" />
      </svg>
    ),
  },
  {
    title: "Files & Docs",
    description: "Upload templates, configs, and docs. Keep everything organized and accessible.",
    color: "#64748b",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    title: "Collections",
    description: "Group items by project or topic. Mixed types allowed — your organized workspace.",
    color: "#6366f1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-secondary/50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Store & Retrieve Fast
          </h2>
          <p className="text-muted-foreground text-lg">
            Purpose-built for developers who are tired of searching forever
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-2xl p-8 transition-all hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg group"
              style={{ "--accent": feature.color } as React.CSSProperties}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white"
                style={{ background: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
