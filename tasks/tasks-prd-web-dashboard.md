## Relevant Files

- `package.json` - Dependencies and build scripts for the React application.
- `webpack.dev.js` & `webpack.prod.js` - Distinct build configurations for development and production.
- `frontend/index.js` - React DOM entry point.
- `frontend/index.css` - Global Vanilla CSS, layout variables, typography, and micro-animation classes.
- `frontend/App.js` - Main application wrapper, setting up context and ErrorBoundary.
- `frontend/context/SensorContext.js` - Global state provider handling API interactions, data storage, and the 10-second polling interval.
- `frontend/utils/api.js` - Centralized HTTP fetch handlers to interact with the Node.js API.
- `frontend/components/AuthModal.js` - Security barrier component prompting for password on initial load.
- `frontend/components/Dashboard.js` - The main container assembling all widgets in a single-page layout.
- `frontend/components/MetricCard.js` - Reusable UI widget for distinct sensor readouts (Temp, Humidity, etc.).
- `frontend/components/TemperatureChart.js` - Dynamic chart visualization component rendering historical arrays.
- `frontend/components/SettingsPanel.js` - Component containing the light threshold slider.
- `frontend/components/ErrorLogModal.js` - Dedicated UI to view fetched database error historical logs.
- `frontend/components/ErrorBoundary.js` - Global error catcher to trap frontend UI crashes and POST them.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use Docker to run Node and NPM tools: e.g., `docker run --rm -v $(pwd):/app -w /app node:latest npm run test`. Do not install Node.js directly.
- **Environment & Execution**: Code is authored directly on the Raspberry Pi. All development and deployment utilize the `node:latest` Docker image via `docker run` with volume mounts. No Dockerfile is used.
- **Completion Protocol**: At the end of each parent task, all changes must be checked into git via a single-line git commit command targeting the master branch.

## Tasks

- [ ] 1.0 React Tooling Setup (in `/frontend` sub-folder)
	- [ ] 1.1 Create the `frontend` directory on the Raspberry Pi for React source code. Configure build tools (Webpack) to compile static assets directly to a designated root serving folder `./build` so the root `server.js` can serve them natively. Run all Node.js/NPM commands using the `node:latest` Docker image.
	- [ ] 1.2 Create distinct Webpack configurations (`webpack.dev.js`, `webpack.prod.js`) and Babel setup per global rules.
	- [ ] 1.3 Scaffold `index.html`, `index.js`, and `App.js`.
	- [ ] 1.4 Verify with Browser Subagent, and check into git.
- [ ] 2.0 Global Styling & Design System Implementation
	- [ ] 2.1 Establish a dark-mode CSS variables palette in `index.css` (deep backgrounds, sleek harmonious accent colors).
	- [ ] 2.2 Import and apply a modern web font (e.g., Inter, Roboto).
	- [ ] 2.3 Define reusable micro-animation utility classes (e.g., subtle drop-shadow expansions, hover scaling).
	- [ ] 2.4 Create docker image, verify with user, and check into git.
- [ ] 3.0 API Services & Global State Management (Context)
	- [ ] 3.1 Create `api.js` to standardize HTTP GET/POST calls dealing with `{ "success", "data", "error" }` payloads.
	- [ ] 3.2 Build functions for `fetchCurrentSensors()`, `fetchHistory(timeframe)`, `postSettings(data)`, and `postError(err)`.
	- [ ] 3.3 Create a `SensorContext.js` provider mapping `useState` variables for telemetry, settings, and historical arrays.
	- [ ] 3.4 Implement a `useEffect` polling mechanism inside context to call `fetchCurrentSensors()` every 10 seconds (only if authenticated).
	- [ ] 3.5 Verify with Browser Subagent, and check into git.
- [ ] 4.0 Authentication Barrier Implementation
	- [ ] 4.1 Build an `AuthModal.js` component with a simple password input and submit handler.
	- [ ] 4.2 Update `App.js` to conditionally render `AuthModal` if access is false.
	- [ ] 4.3 Ensure the `SensorContext` polling interval only activates upon successful password matching.
	- [ ] 4.4 Verify with Browser Subagent, and check into git.
- [ ] 5.0 Dashboard Layout & Real-Time Metric Cards
	- [ ] 5.1 Implement a grid-based `Dashboard.js` component as the application core.
	- [ ] 5.2 Build a highly visual `MetricCard.js` component utilizing gradients and animations.
	- [ ] 5.3 Instantiate distinct cards for Temperature, Humidity, Light, and Door State, piping live Context data into them.
	- [ ] 5.4 Engineer visual alert states: update MetricCard styling dramatically (e.g., border pulsing red) when Door is OPEN or Light > Threshold.
	- [ ] 5.5 Verify with Browser Subagent, and check into git.
- [ ] 6.0 Historical Trend Visualization (Line Charts)
	- [ ] 6.1 Build `TemperatureChart.js` directly drawing a dynamic SVG line chart to map the historical data array, avoiding any third-party charting libraries.
	- [ ] 6.2 Style the SVG paths (stroke, fill) to match the dark-mode aesthetic (e.g., distinct scalable lines).
	- [ ] 6.3 Implement a segmented toggle control (1h, 5h, 24h) that triggers `fetchHistory()` and forces the SVG chart to re-render.
	- [ ] 6.4 Verify with Browser Subagent, and check into git.
- [ ] 7.0 Settings Panel & Global Error Handling UI
	- [ ] 7.1 Implement `SettingsPanel.js` containing an interactive slider for the light threshold; POST changes to backend on adjustment.
	- [ ] 7.2 Create an `ErrorBoundary.js` component wrapping the tree. On `componentDidCatch`, POST the error stack trace to the API.
	- [ ] 7.3 Build an `ErrorLogModal.js` capable of fetching `/api/errors` and presenting a historical table of exceptions.
	- [ ] 7.4 Verify with Browser Subagent, and check into git.
- [ ] 8.0 Responsive Refinement & Final Testing
	- [ ] 8.1 Write media queries in `index.css` to collapse the Dashboard grid into a single column for mobile viewports.
	- [ ] 8.2 Perform manual validation: verify password block, test polling without page refreshes, and evaluate visual alert changes dynamically.
	- [ ] 8.3 Verify with Browser Subagent, and check into git.
- [ ] 9.0 Deployment Configuration & Handoff
	- [ ] 9.1 Provide clear documentation/terminal output reminding the user what the configured authentication password is.
	- [ ] 9.2 Remind the user of any remaining environment values, database URI changes, or API endpoint configurations needed for the production build.
	- [ ] 9.3 Verify with Browser Subagent, and check into git.
