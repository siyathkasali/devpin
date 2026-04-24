# Load Action

1. Check $ARGUMENTS (after "load"):
   - If it looks like a filename (single word, no spaces): Look for `context/features/{name}.md` OR `context/fixes/{name}.md`
   - If it's multiple words: Use as inline feature description, generate goals
   - If empty: Error - "load" requires a spec filename or feature description

2. Update current-feature.md:
   - Update H1 heading to include feature name (e.g., `# Current Feature: Add Navbar`)
   - Write goals as bullet points under ## Goals
   - Write any additional notes/context under ## Notes
   - Set Status to "Not Started"

3. **Ask before implementing** - Always ask the user if they want to proceed with implementation before making any changes. Never auto-implement.

4. Confirm spec loaded and show the feature summary