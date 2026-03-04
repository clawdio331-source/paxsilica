# The Capex Peace Lobby — Interactive Spec

## What this is

A scrollytelling interactive where the user moves through a conflict timeline (Day 0 to Day 360) and watches the $700B AI buildout degrade in real time. The narrative backbone follows the thesis that big capex spenders are the strongest force pushing for a Middle East resolution because their project economics break before diplomacy catches up.

The interaction model is inspired by ai-2027.com: a linear narrative that the user scrolls through, with embedded data visualizations and calculators that respond to a persistent timeline slider. The difference is that ai-2027.com is speculative fiction along a single path. This is a branching scenario tree where the user decides how the conflict evolves at key checkpoints and the entire downstream model reshapes itself based on those choices.

---

## Core interaction

### The Timeline Slider

A persistent, sticky element (bottom of viewport or sidebar) that represents conflict duration from Day 0 (pre-escalation baseline) to Day 360. The user can either scroll through the narrative which advances the slider automatically, or drag the slider directly to jump to any point in the conflict timeline.

As the slider moves, every data visualization on the page updates. Charts animate, numbers recalculate, narrative callouts shift tone.

### The Checkpoint Fork System

Wars do not degrade linearly. They escalate, de-escalate, mutate. At key checkpoints (Day 30, Day 60, Day 90, Day 120, Day 180) the scroll pauses and the user is presented with two buttons representing divergent paths for how the conflict has evolved. The choice the user makes at each checkpoint reshapes all downstream metrics, narrative tone, and visualizations.

This is the core differentiator from a simple slider tool. The user is not passively watching numbers move. They are constructing a scenario by making judgment calls about the nature of the conflict at each stage. Two users can arrive at Day 180 with completely different buildout impact profiles because they chose different escalation paths.

**Checkpoint UI behavior:**
- Scroll stops. The viewport locks on the checkpoint screen.
- Two large buttons appear side by side, each with a short label and a 1-2 sentence description of what that path implies.
- The user must pick one to continue. No default, no skip.
- Once chosen, the selected path glows and the page smoothly transitions into the next narrative section with all data recalculated for that branch.
- A "path history" strip appears on the sticky metrics panel showing which choices the user has made so far (compact icons or labels). The user can click any previous checkpoint in the strip to go back and change their mind, which recalculates everything downstream.

### The Scenario State

The page is no longer driven by a single variable. It is driven by:

```
conflictDay: number (0-360)
checkpointChoices: {
  day30: "contained" | "spreading",
  day60: "diplomatic_signals" | "strait_closed",
  day90: "proxy_stalemate" | "direct_engagement",
  day120: "dpa_activated" | "market_rationing",
  day180: "resolution_forming" | "permanent_restructuring"
}
```

Every derived metric is now a function of both `conflictDay` AND the accumulated checkpoint choices. The same Day 150 looks radically different depending on whether the user chose "Strait Closed" at Day 60 vs "Diplomatic Signals."

### Scroll behavior

The page is divided into narrative sections. Each section occupies roughly one viewport height. As the user scrolls into a section, the timeline slider advances to the corresponding conflict day range. The scroll should feel smooth with snap points at each section boundary. At checkpoint days, scroll locks until the user makes a choice.

---

## Page structure

### Section 0 — The Baseline (Day 0)
**Purpose:** Establish what the world looked like before escalation.

**Narrative content:**
- The $710B capex commitment across hyperscalers
- Gulf region positioned as the "New Switzerland" for compute
- Supply chain routes running clean through the Strait of Hormuz
- Maritime insurance at normal premiums, air freight at standard rates

**Visual element:** A world map showing the supply chain. Clean lines from Asian fabrication (Japan, Taiwan, South Korea) through the Strait of Hormuz to Gulf data center sites and onward to US facilities. All lines are green. A sidebar shows key metrics at baseline values.

**Live metrics panel (sticky, updates with slider and checkpoint choices):**
- Maritime insurance premium: baseline %
- Air freight cost index: baseline (1.0x)
- Capex burn rate vs plan: 100% on track
- Supply chain throughput: 100%
- Estimated buildout delay: 0 months
- Dual-use allocation to defense: 0%
- Path history: [empty]

---

### Section 1 — The First 30 Days (Day 1-30)
**Purpose:** Show the initial shock and how markets reprice risk before physical supply chains break.

**Narrative content:**
- Strait of Hormuz contested, shipping reroutes begin
- Insurance premiums jump, first procurement delays surface
- Hyperscalers start drawing down existing inventory
- The mood is "this will blow over" but procurement teams are already scrambling

**Visual element:** The world map lines shift from green to yellow on Gulf routes. A new route appears (longer, around Africa) in orange. The metrics panel starts moving.

**Embedded calculator — "The Insurance Multiplier":**
User can input a maritime insurance premium % and see the downstream cost impact on a per-GPU basis. Default auto-populates based on slider position. Shows how a 50% insurance premium translates to X% cost increase on delivered hardware.

---

### ⑂ CHECKPOINT 1 — Day 30: The Nature of the Conflict

Scroll locks. Two buttons appear:

**Option A: "Contained Escalation"**
The conflict stays regional. Strikes are targeted, no ground invasion. Shipping is disrupted but the Strait is not fully closed. Insurance premiums stabilize at elevated levels. The market prices in a 60-90 day disruption.

**Option B: "Spreading"**
The conflict expands. New fronts open. Houthi activity intensifies, non-state actors enter the picture. The insurance market starts pricing in a longer and wider disruption. First signs that this could become a multi-theater situation.

**Impact on downstream model:**
- Option A: metrics degrade on a moderate curve. Supply chain throughput drops 15-25% over next 30 days.
- Option B: metrics degrade on a steep curve. Supply chain throughput drops 35-50% over next 30 days. Air freight multiplier jumps an additional 1.5x.

---

### Section 2 — The 60-Day Wall (Day 31-60)
**Purpose:** This is where inventory buffers run out and the physical reality hits.

**Narrative content (adapts based on Checkpoint 1 choice):**

*If "Contained":*
- Inventory drawdown is orderly but accelerating
- Resonac (4004), Entegris (ENTG), Ibiden (4062) reporting delays but managing
- Gulf data center projects paused but not cancelled
- Procurement teams have found partial workarounds through rerouting

*If "Spreading":*
- Inventory cliff hits hard across multiple substrate categories
- Resonac, Entegris, Ibiden issuing force majeure notices on select contracts
- Gulf data center projects cancelled outright, sunk costs written off
- Rerouting capacity is overwhelmed as other shippers compete for the same Cape routes

**Visual element:** Map lines to Gulf go red (both paths) but the severity of the rest of the map differs. Bar chart shows inventory levels declining, with slope determined by Checkpoint 1 choice. Company tickers appear next to supply chain nodes with status indicators.

**Embedded calculator — "The Inventory Cliff":**
Shows days-of-inventory remaining for key substrate categories. Consumption rate adjusts based on Checkpoint 1 choice. User can toggle between "peacetime consumption" and "wartime consumption" to see how defense allocation accelerates the cliff.

---

### ⑂ CHECKPOINT 2 — Day 60: The Strait Question

**Option A: "Diplomatic Signals"**
Backchannel talks surface. The Strait remains contested but not closed. Insurance premiums plateau. There is a credible path to partial normalization within 60 days. Markets rally briefly.

**Option B: "Strait Closed"**
The Strait of Hormuz is functionally closed to commercial traffic. Full reroute around the Cape of Good Hope adds 14-21 days to every shipment. Insurance premiums go parabolic. This is the scenario where the economics of the buildout break structurally.

**Impact on downstream model:**
- Option A: throughput stabilizes at degraded levels. Recovery becomes possible without full resolution. Buildout delay estimate: 3-6 months.
- Option B: throughput enters freefall. No recovery possible until Strait reopens. Maritime insurance hits 80%+. Buildout delay estimate: 9-18 months. This path also triggers the dual-use allocation problem much faster as the government views the closure as a national security emergency.

---

### Section 3 — The Dual-Use Fork (Day 61-90)
**Purpose:** Introduce the Defense Production Act scenario where the buildout competes with munitions.

**Narrative content (adapts based on both checkpoints):**

*Core narrative regardless of path:*
- The same high-purity chemicals used for AI chips go into missile guidance
- Companies like Resonac face allocation decisions imposed by government
- The capex spenders lose supply to their own government's munitions priorities

*If "Contained + Diplomatic Signals":*
- DPA is discussed but not activated
- Defense allocation happens informally through government "requests"
- Commercial allocation drops to ~85% of baseline

*If "Spreading + Strait Closed":*
- DPA is formally activated
- Mandatory allocation to defense takes 25-40% of key substrate supply
- Commercial allocation craters, some categories hit zero availability
- This is the scenario that keeps CFOs up at night

**Visual element:** Sankey diagram showing material flows. The split between commercial and defense adjusts based on checkpoint choices. The visual should make it viscerally clear that the pie is being redistributed and the speed of that redistribution depends on the escalation path.

**Key threshold callout:** Highlight the crossover point where defense allocation starts materially impacting GPU production schedules. This arrives at Day 75 on the severe path, Day 110 on the contained path.

---

### ⑂ CHECKPOINT 3 — Day 90: The Character of the War

**Option A: "Proxy Stalemate"**
The conflict settles into a grinding proxy war. No clear escalation, no clear de-escalation. The worst state for supply chains because there is no catalyst for resolution but also no acute crisis to force emergency measures. Markets adapt to a "new normal" of degraded throughput.

**Option B: "Direct Engagement"**
Major powers are directly involved. This is now a conventional conflict with state actors. Military logistics take absolute priority. The defense apparatus absorbs supply chain capacity as a matter of wartime necessity.

**Impact on downstream model:**
- Option A: metrics plateau at degraded levels. Slow bleed. The buildout is delayed but alive. Lobby pressure builds gradually because the damage is chronic, hard to point to a single breaking point.
- Option B: metrics crater. The buildout is effectively frozen. Emergency measures redirect all dual-use materials. Lobby pressure spikes immediately because the timeline for AGI is now measured in years of delay, and the national security argument flips from "we need AI supremacy" to "we need munitions now."

---

### Section 4 — The Quarterly Earnings Problem (Day 91-120)
**Purpose:** Show how the financial reporting cycle forces the hand of corporate leadership.

**Narrative content (adapts based on all three checkpoints):**

*Core narrative:*
- Q2 earnings season arrives with buildout behind schedule
- Capex guidance gets revised downward
- The gap between committed capex and deployable capex becomes the story

*Severity scales with path:*
- Mildest path (Contained → Diplomatic → Stalemate): guidance revised down 10-15%, "temporary headwind" language, stock impact manageable
- Moderate path (mixed choices): guidance revised down 25-35%, analyst calls get hostile, multiple hyperscalers miss deployment targets
- Severe path (Spreading → Closed → Direct): guidance revised down 50%+, some hyperscalers announce capex deferrals, the AI buildout narrative in public markets takes structural damage

**Visual element:** Simulated earnings dashboard showing:
- Capex committed vs capex deployed (gap size determined by path)
- Estimated revenue impact from delayed capacity
- Stock price sensitivity chart (market cap cost per quarter of delay)

**Embedded calculator — "The Guidance Gap":**
Input: planned capex for a hyperscaler. Output: stranded capex at current conflict duration and path. The number changes dramatically based on checkpoint choices.

---

### ⑂ CHECKPOINT 4 — Day 120: The Allocation Response

**Option A: "DPA Activated"**
The government formally invokes the Defense Production Act. Mandatory allocation percentages are imposed on dual-use material producers. Commercial buyers queue behind military contracts. This is orderly but devastating for the buildout timeline.

**Option B: "Market Rationing"**
No formal DPA but the market rations itself. Producers prioritize defense contracts voluntarily because the margins are guaranteed and the political risk of saying no is existential. The result is similar to DPA but less predictable, with some producers honoring commercial contracts while others don't. Chaos pricing emerges.

**Impact on downstream model:**
- Option A: dual-use allocation to defense jumps to a fixed percentage (30-50% depending on prior path). Predictable, plannable, terrible. The buildout can model around it.
- Option B: dual-use allocation is volatile, swinging between 20-60% week to week. Impossible to plan around. Procurement teams cannot commit to fabrication schedules. This path is worse for the buildout even if the average allocation is lower, because the variance kills planning.

---

### Section 5 — The Lobby Inflection (Day 121-180)
**Purpose:** The political economy section. Show why and how the capex spenders become the peace lobby.

**Narrative content (adapts based on all four checkpoints):**

*Core narrative regardless of path:*
- AI directive from late February frames AGI as century-defining
- The companies funding the AGI race are the primary contractors of the national security state
- When they engage the White House about shipping lanes, that is a national security briefing with a capex deadline attached
- The administration cannot claim AI supremacy as doctrine and allow a regional war to starve the chip supply chain

*Lobby intensity scales with path severity:*
- Mild paths: quiet lobbying, private meetings, "concern" expressed in earnings calls
- Moderate paths: coordinated industry letters, public statements from CEOs, lobbying spend spikes
- Severe paths: emergency meetings with the National Security Council, AI companies threatening to move capex offshore, public break between Silicon Valley and the administration's conflict posture

**Visual element:** Lobbying pressure index that increases with conflict duration and path severity. Show the convergence point where national security interest and corporate interest become indistinguishable. On severe paths, this convergence happens much earlier.

---

### ⑂ CHECKPOINT 5 — Day 180: The Endgame

**Option A: "Resolution Forming"**
A diplomatic framework emerges. Ceasefire talks gain traction. The Strait begins limited reopening under naval escort. Markets price in recovery. The question shifts from "how bad does it get" to "how long until we're back to baseline."

**Option B: "Permanent Restructuring"**
No resolution in sight. The conflict has become structural. Supply chains are being permanently rerouted. Companies are writing off Gulf investments entirely. The AI buildout is being replanned around a world where the Middle East corridor does not exist for the foreseeable future. This is the new baseline.

**Impact on downstream model:**
- Option A: metrics begin recovering. Recovery lag calculator activates showing asymmetric recovery (fast initial bounce, long tail to full normalization). Buildout resumes on a delayed timeline.
- Option B: metrics do not recover. They stabilize at a permanently degraded level. The buildout is repriced from the ground up. $710B becomes $400-500B deployed over 2x the original timeline. The US cedes AGI timeline advantage.

---

### Section 6 — Pax Silica or The New Map (Day 181-270)
**Purpose:** Diverges completely based on Checkpoint 5.

*If "Resolution Forming":*
- The resolution is heavy-handed and fast
- Framed publicly as energy security but fundamentally about silicon logistics
- He who controls the shipping lanes controls the buildout
- The buildout is now indistinguishable from the national interest
- The map begins to heal. Green lines return. Recovery curve shows normalization timeline.

*If "Permanent Restructuring":*
- The map is redrawn. New supply routes through the Indian Ocean, expanded Pacific corridor
- Gulf compute ambitions are dead for a generation
- The capex goes domestic or to allied nations only
- The buildout survives but it is smaller, slower, more expensive
- A new map visualization replaces the old one with entirely different trade routes

**Embedded calculator — "The Recovery Lag" (Resolution path) / "The Repricing" (Restructuring path):**
- Resolution: input resolution day, output days to normalize. Asymmetry: damage is fast, recovery is slow. 90-day conflict takes ~180 days to fully unwind.
- Restructuring: input the new baseline throughput, output the revised buildout timeline and total capex deployment. Shows what $710B becomes in this reality.

---

### Section 7 — The Final Accounting (Day 271-360)
**Purpose:** Show the full scenario summary based on every choice the user has made.

**Visual element:** A comprehensive summary card displaying:
- The path the user took (all 5 checkpoint choices shown as a decision tree)
- Final state of every metric
- Total buildout delay
- Total stranded capex
- The "lobby pressure score" which quantifies how hard the capex spenders would push for resolution under this specific scenario
- A comparison: "Your scenario vs the average of all possible paths"

**Closing narrative:**
The capex spenders are anti-war out of arithmetic. This is what the arithmetic looks like under the scenario you constructed. Drag the path history to try different choices and see how the arithmetic changes.

**Replay prompt:** A clear call-to-action to go back and explore different paths. The path history strip in the metrics panel is clickable at every checkpoint.

---

## The Path Tree (all possible scenarios)

There are 5 checkpoints with 2 choices each, making 32 possible terminal states. In practice, many of these converge on similar outcomes. The model should handle all 32 but the narrative only needs to branch meaningfully where the choices create materially different outcomes.

**High-impact branch points** (where the choice dramatically changes the downstream model):
- Checkpoint 2 (Strait question) is the single most impactful fork. "Strait Closed" vs "Diplomatic Signals" is the difference between the buildout being delayed vs the buildout being broken.
- Checkpoint 5 (Endgame) determines whether there is a recovery arc or a permanent repricing.

**Lower-impact branch points** (where the choices shade the severity but don't change the fundamental shape):
- Checkpoint 1 (Contained vs Spreading) sets initial slope but gets overridden by Checkpoint 2.
- Checkpoint 3 (Stalemate vs Direct) affects the character of the degradation but not the magnitude as much.
- Checkpoint 4 (DPA vs Market Rationing) is mainly about predictability vs chaos.

For vibecoding purposes, the model can be simplified by weighting each checkpoint choice as a severity score (0 or 1) and computing a composite "escalation index" that drives the curves. More granular branching can be layered in later.

```
escalationIndex = (
  checkpoint1 * 0.15 +
  checkpoint2 * 0.35 +
  checkpoint3 * 0.20 +
  checkpoint4 * 0.10 +
  checkpoint5 * 0.20
)
```

Where each checkpoint value is 0 (de-escalation choice) or 1 (escalation choice). This single composite, combined with `conflictDay`, can drive all metric functions as a first pass.

---

## Data model (updated for branching)

```
// Primary state
conflictDay: number (0-360)
checkpointChoices: Record<string, 0 | 1>  // 0 = de-escalation, 1 = escalation
escalationIndex: number (0-1, computed from weighted checkpoints)

// Derived metrics, all functions of (conflictDay, escalationIndex)
maritimeInsurancePremium(day, ei) → percentage
airFreightMultiplier(day, ei) → multiplier
supplyChainThroughput(day, ei) → percentage of baseline
dualUseDefenseAllocation(day, ei) → percentage redirected
capexDeploymentRate(day, ei) → percentage of planned deployable
buildoutDelay(day, ei) → months added
inventoryDaysRemaining(day, ei, category) → days until stockout
guidanceGap(day, ei, plannedCapex) → stranded dollar amount
lobbyPressureIndex(day, ei) → composite index (0-100)
recoveryLag(day, ei) → days to normalize post-resolution

// Checkpoint-specific overrides
// Some checkpoints trigger step-function changes rather than smooth curves:
// - Checkpoint 2 "Strait Closed": throughput drops 40% instantly
// - Checkpoint 3 "Direct Engagement": defense allocation jumps 25% instantly
// - Checkpoint 4 "DPA Activated": adds variance dampener (predictable degradation)
// - Checkpoint 4 "Market Rationing": adds variance amplifier (chaotic degradation)
```

### Suggested function shapes (updated)

All curves are now parameterized by escalationIndex (ei):

- **Maritime insurance:** Exponential ramp, steepness = f(ei). At ei=0 it plateaus around 30%. At ei=1 it goes parabolic past 80%.
- **Supply chain throughput:** S-curve degradation. Inflection point shifts earlier with higher ei. At ei=0 throughput floors at ~70%. At ei=1 throughput floors at ~30%.
- **Dual-use allocation:** Step function with step size = f(ei). Mild paths see 5-15% allocation. Severe paths see 30-50%.
- **Capex deployment rate:** Linear then accelerating decline. The acceleration point shifts earlier with higher ei.
- **Lobby pressure:** Gradual build with inflection at earnings season (~Day 90). Peak value scales with ei. At ei=1 it hits maximum well before Day 180.
- **Recovery lag:** 1.5-2.5x conflict duration depending on ei. Higher ei = longer recovery multiplier.

---

## Design and feel

### Visual language
- Dark background, light text. Serious, analytical.
- Data visualizations in a restrained palette. Green for baseline/healthy, amber for stress, red for critical.
- No decorative elements. Every visual earns its place by carrying data.
- Typography should feel like a research publication. Serif for headings, clean sans-serif for body.

### The checkpoint moments
These should feel like a pause in the narrative. The background dims slightly. The two buttons are the only interactive elements. The choice feels weighty. Once made, the transition into the recalculated world should have a brief animation (metrics shifting, map lines changing color) so the user viscerally feels the impact of their choice.

### The sticky metrics panel
Always visible. Updates in real time with slider AND checkpoint choices. Includes a compact "path history" strip showing the choices made so far as small labeled nodes (e.g., "Contained → Strait Closed → Stalemate → DPA → ..."). Each node is clickable to revisit that checkpoint.

### Expandable depth sections
Collapsed by default, offering deeper context:
- "How maritime insurance pricing works"
- "What are dual-use materials?"
- "The Defense Production Act, explained"
- "How GPU supply chains actually work"
- "The Strait of Hormuz by the numbers"
- "What is an escalation index?"

### Mobile behavior
Timeline slider at bottom as horizontal bar. Metrics panel collapses to 3 key numbers (tap to expand). Checkpoint buttons stack vertically instead of side by side. Path history strip scrolls horizontally.

---

## Tech stack recommendation (for vibecoding)

- **Framework:** Next.js or plain React with Vite
- **Scroll engine:** GSAP ScrollTrigger or Framer Motion for scroll-linked animations and checkpoint locking
- **Charts:** D3.js for the custom visualizations (Sankey, map, animated charts) or Recharts for simpler bar/line charts
- **Map:** Styled SVG world map (sufficient since we only need trade routes, not full geographic detail)
- **State management:** Zustand or React context. State shape: `{ conflictDay, checkpointChoices, escalationIndex }`. All derived metrics are computed selectors.
- **Slider:** Custom range input styled dark, synced with scroll position via Intersection Observer
- **Checkpoint UI:** Modal-like overlay triggered by scroll position. Locks scroll until choice is made. Can be implemented with GSAP ScrollTrigger pinning.

---

## What success looks like

A user lands on the page. They start scrolling. Within 10 seconds they understand the thesis: the longer this war goes, the more the AI buildout breaks, and the people with the most money on the line will push hardest for resolution.

At Day 30, the scroll stops. They have to make a call. This is the moment the tool goes from passive reading to active scenario building. They pick a path, the numbers shift, and suddenly they own the scenario. They are no longer reading someone else's analysis. They are constructing their own.

By the time they reach the bottom, they have built a specific conflict scenario with 5 deliberate choices and seen the precise buildout impact of that scenario. The closing card shows them their arithmetic. Then they go back and try a different path because they want to see what changes.

The slider is the hook. The checkpoints are the engagement engine. The narrative is the education. The calculators are the conviction builders. The path replay is the retention mechanic.
