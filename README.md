## Inspiration
Navigating urban spaces can be difficult for wheelchair users and those with mobility challenges. While Google Maps provides some accessibility options, many paths still contain unexpected obstacles like stairs or steep inclines. We wanted to create a reliable, accessible routing solution that ensures wheelchair users have clear, safe, and barrier-free paths.

## What it does
PathAble is a wheelchair-accessible route planner that generates optimized walking and transit routes while avoiding stairs, steep inclines, and inaccessible paths. It integrates Google Maps APIs, Elevation Data, and Accessibility Filters to provide:

- Wheelchair-friendly walking routes that avoid stairs and steep inclines.
- Public transit routes that prioritize accessible stations and fewer transfers.
- Dynamic rerouting based on accessibility constraints.
- User-generated reports on obstacles (e.g., broken elevators, blocked pathways).

## How we built it
Utilized various Google cloud-related APIs, as well as Lovable and Cursor. 

## Challenges we ran into
- Lack of direct accessibility data
- Snap-to-Roads limitations – The API works well for driving but struggles with pedestrian paths.
- Query limits – Google’s API usage limits required optimizations in our API calls.

## Accomplishments that we're proud of
We learned how to utilize various AI tools to help with our project.

## What we learned
Implementing Google Maps API into a web-dev app, utilizing various AI tools such as Lovable, Cursor, Claude and debugging AI-generated code.
