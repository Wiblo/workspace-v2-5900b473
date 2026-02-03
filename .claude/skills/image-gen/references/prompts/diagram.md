# Technical Diagrams

Generate flowcharts, architecture diagrams, and technical illustrations.

## Recommended Settings

| Diagram Type | Aspect Ratio | Resolution |
|--------------|--------------|------------|
| Flowchart (vertical) | portrait (3:4) | 2K |
| Flowchart (horizontal) | landscape (16:9) | 2K |
| Architecture diagram | landscape (16:9) | 4K |
| Comparison/matrix | landscape (4:3) | 2K |
| Process (linear) | wide (21:9) | 2K |

## Prompt Structure

```
[Description], [type] diagram, [style] style, [layout] layout,
[complexity] detail level, [colors], clear labels, technical illustration
```

## Diagram Types

### Flowchart
Decision trees, process flows, user journeys.

```json
{
  "prompt": "User signup flowchart: Start -> Enter email -> Validate -> Branch (valid/invalid) -> If valid: Create account -> Verify email -> Complete. Clean boxes with rounded corners, arrows connecting steps. Blue (#3B82F6) and gray color scheme. Clear labels. Vertical layout.",
  "filename": "diagram-signup-flow.png",
  "aspectRatio": "3:4",
  "resolution": "2K"
}
```

### Architecture Diagram
System design, infrastructure, tech stack.

```json
{
  "prompt": "Cloud architecture diagram: Web app connecting to load balancer, then to 3 API servers, connecting to database cluster and Redis cache. CDN on the side for static assets. Modern flat style, blue and gray colors. Clear labels, connection arrows. Horizontal layout.",
  "filename": "diagram-architecture.png",
  "aspectRatio": "16:9",
  "resolution": "4K"
}
```

### Process/Timeline
Step-by-step procedures, project timelines.

```json
{
  "prompt": "5-step onboarding process: 1. Sign up 2. Verify email 3. Complete profile 4. Connect accounts 5. Start using. Horizontal timeline with numbered circles connected by lines. Icons for each step. Green (#10B981) accent color. Clean modern style.",
  "filename": "diagram-onboarding.png",
  "aspectRatio": "21:9",
  "resolution": "2K"
}
```

### Comparison/Matrix
Feature comparisons, decision matrices.

```json
{
  "prompt": "Feature comparison diagram: 3 columns (Basic, Pro, Enterprise) with rows showing features. Checkmarks for included, X for not included. Clean table layout, alternating row colors. Blue header, gray body. Professional style.",
  "filename": "diagram-comparison.png",
  "aspectRatio": "4:3",
  "resolution": "2K"
}
```

### Hierarchy/Org Chart
Organization structures, taxonomies.

```json
{
  "prompt": "Company org chart: CEO at top, branching to 4 department heads (Engineering, Product, Sales, Operations), each with 2-3 team members below. Clean boxes connected by lines. Navy and white color scheme. Centered layout.",
  "filename": "diagram-org.png",
  "aspectRatio": "landscape",
  "resolution": "2K"
}
```

## Batch: Documentation Diagrams

```json
[
  {
    "prompt": "API request flow diagram: Client -> API Gateway -> Authentication -> Rate Limiter -> Service Router -> Microservice -> Database. Horizontal flow with labeled arrows showing request/response. Technical style, blue and gray.",
    "filename": "diagram-api-flow.png",
    "aspectRatio": "21:9",
    "resolution": "2K"
  },
  {
    "prompt": "Data pipeline diagram: Source databases -> ETL process -> Data warehouse -> Analytics engine -> Dashboard. Flowing horizontal layout with icons for each component. Purple (#7C3AED) accent. Modern tech style.",
    "filename": "diagram-data-pipeline.png",
    "aspectRatio": "16:9",
    "resolution": "2K"
  },
  {
    "prompt": "User journey map: 5 stages (Awareness, Consideration, Decision, Onboarding, Retention) with touchpoints and emotions at each stage. Horizontal timeline, icons and brief labels. Warm colors for positive, cool for challenges.",
    "filename": "diagram-user-journey.png",
    "aspectRatio": "21:9",
    "resolution": "2K"
  }
]
```

## Style Tips

1. **Keep it simple** - Don't overcrowd with details
2. **Clear labels** - Always specify "clear labels" in prompt
3. **Consistent style** - Use same colors/shapes throughout
4. **Logical flow** - Specify direction (vertical, horizontal, radial)
5. **Limited colors** - 2-3 colors max for clarity

## Color Schemes by Purpose

| Purpose | Colors |
|---------|--------|
| Technical/Engineering | Blue, gray, white |
| Business/Process | Navy, gold, white |
| Marketing/Creative | Vibrant gradients |
| Data/Analytics | Purple, teal, gray |
| Warning/Error flows | Red, orange accents |
| Success paths | Green accents |
