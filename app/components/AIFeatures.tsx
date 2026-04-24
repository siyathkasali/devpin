export function AIFeatures() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-xs font-semibold uppercase tracking-wider text-white mb-6">
            Pro Feature
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            AI Superpowers for Your Knowledge
          </h2>
          <ul className="space-y-4">
            {[
              "Auto-tagging — AI suggests relevant tags as you write",
              "AI summaries — Quick overview of any item",
              "Explain Code — Get instant explanations of confusing snippets",
              "Prompt optimizer — Improve your AI prompts automatically",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-muted-foreground">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#1e1e2e] rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#282839] border-b border-border">
            <span className="text-sm text-muted-foreground font-mono">TypeScript</span>
            <span className="text-xs text-green-500 bg-green-500/15 px-2 py-1 rounded">
              AI Generated
            </span>
          </div>
          <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
            <code className="text-[#cdd6f4]">
              <span className="text-[#cba6f7]">interface</span>{" "}
              <span className="text-[#f9e2af]">User</span>{" "}
              <span className="text-[#f38ba8]">{"{"}</span>
              {"\n"}  <span className="text-[#89b4fa]">id</span>
              <span className="text-[#bac2de]">:</span>{" "}
              <span className="text-[#f9e2af]">string</span>
              <span className="text-[#bac2de]">;</span>
              {"\n"}  <span className="text-[#89b4fa]">email</span>
              <span className="text-[#bac2de]">:</span>{" "}
              <span className="text-[#f9e2af]">string</span>
              <span className="text-[#bac2de]">;</span>
              {"\n"}  <span className="text-[#89b4fa]">role</span>
              <span className="text-[#bac2de]">:</span>{" "}
              <span className="text-[#f9e2af]">&quot;admin&quot;</span>{" "}
              <span className="text-[#bac2de]">|</span>{" "}
              <span className="text-[#f9e2af]">&quot;user&quot;</span>
              <span className="text-[#bac2de]">;</span>
              {"\n"}
              <span className="text-[#f38ba8]">{"}"}</span>
              {"\n\n"}
              <span className="text-[#6c7086]">// AI Tags: typescript, interface, user-model, types</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
