## Relevant Files

- `frontend/package.json` - Dependencies and build scripts for the React application.
- `frontend/webpack.dev.js` & `frontend/webpack.prod.js` - Distinct build configurations for development and production.
- `frontend/src/index.js` - React DOM entry point.
- `frontend/src/index.css` - Global Vanilla CSS, layout variables, typography, and micro-animation classes.
- `frontend/src/App.js` - Main application wrapper, setting up context and ErrorBoundary.
- `frontend/src/context/SensorContext.js` - Global state provider handling API interactions, data storage, and the 10-second polling interval.
- `frontend/src/utils/api.js` - Centralized HTTP fetch handlers to interact with the Node.js API.
- `frontend/src/components/AuthModal.js` - Security barrier component prompting for password on initial load.
- `frontend/src/components/Dashboard.js` - The main container assembling all widgets in a single-page layout.
- `frontend/src/components/MetricCard.js` - Reusable UI widget for distinct sensor readouts (Temp, Humidity, etc.).
- `frontend/src/components/TemperatureChart.js` - Dynamic chart visualization component rendering historical arrays.
- `frontend/src/components/SettingsPanel.js` - Component containing the light threshold slider.
- `frontend/src/components/ErrorLogModal.js` - Dedicated UI to view fetched database error historical logs.
- `frontend/src/components/ErrorBoundary.js` - Global error catcher to trap frontend UI crashes and POST them.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `npx jest` to run tests.
- **Environment & Execution**: Code is authored locally on Windows (`[WIN]`). Deploy to the remote dev server (`[RPI]`) into `/home/bvanbeynum/dev/officecommand/frontend` using SSH/rsync/wsl. All Git operations are run on the remote dev server targeting the `master` branch.
- **Browser Testing**: Use the AI Browser Subagent to autonomously test on the remote dev server's exposed port. 
- **Completion Protocol**: At the end of each parent task, all changes must be moved to the dev server and checked into git via a single-line git commit command targeting the master branch.

## Tasks

- [ ] 1.0 React Tooling Setup (in `/frontend` sub-folder)
  - [ ] 1.1 `[RPI]` Connect to the dev server and navigate to `/home/bvanbeynum/dev/officecommand`.
  - [ ] 1.2 `[RPI]` Create the `frontend` directory on the dev server for React source code. Configure build tools (Webpack) to compile static assets directly to a designated root serving folder (e.g., `../public` or `../dist`) so the root `server.js` can serve them natively.
  - [ ] 1.3 `[RPI]` Create distinct Webpack configurations (`webpack.dev.js`, `webpack.prod.js`) and Babel setup per global rules.
  - [ ] 1.4 `[RPI]` Scaffold `index.html`, `index.js`, and `App.js`.
  - [ ] 1.5 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
- [ ] 2.0 Global Styling & Design System Implementation
  - [ ] 2.1 `[WIN]` Establish a dark-mode CSS variables palette in `index.css` (deep backgrounds, sleek harmonious accent colors).
  - [ ] 2.2 `[WIN]` Import and apply a modern web font (e.g., Inter, Roboto).
  - [ ] 2.3 `[WIN]` Define reusable micro-animation utility classes (e.g., subtle drop-shadow expansions, hover scaling).
  - [ ] 2.4 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
- [ ] 3.0 API Services & Global State Management (Context)
  - [ ] 3.1 `[WIN]` Create `api.js` to standardize HTTP GET/POST calls dealing with `{ "success", "data", "error" }` payloads.
  - [ ] 3.2 `[WIN]` Build functions for `fetchCurrentSensors()`, `fetchHistory(timeframe)`, `postSettings(data)`, and `postError(err)`.
  - [ ] 3.3 `[WIN]` Create a `SensorContext.js` provider mapping `useState` variables for telemetry, settings, and historical arrays.
  - [ ] 3.4 `[WIN]` Implement a `useEffect` polling mechanism inside context to call `fetchCurrentSensors()` every 10 seconds (only if authenticated).
  - [ ] 3.5 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
- [ ] 4.0 Authentication Barrier Implementation
  - [ ] 4.1 `[WIN]` Build an `AuthModal.js` component with a simple password input and submit handler.
  - [ ] 4.2 `[WIN]` Update `App.js` to conditionally render `AuthModal` if access is false.
  - [ ] 4.3 `[WIN]` Ensure the `SensorContext` polling interval only activates upon successful password matching.
  - [ ] 4.4 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
- [ ] 5.0 Dashboard Layout & Real-Time Metric Cards
  - [ ] 5.1 `[WIN]` Implement a grid-based `Dashboard.js` component as the application core.
  - [ ] 5.2 `[WIN]` Build a highly visual `MetricCard.js` component utilizing gradients and animations.
  - [ ] 5.3 `[WIN]` Instantiate distinct cards for Temperature, Humidity, Light, and Door State, piping live Context data into them.
  - [ ] 5.4 `[WIN]` Engineer visual alert states: update MetricCard styling dramatically (e.g., border pulsing red) when Door is OPEN or Light > Threshold.
  - [ ] 5.5 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
- [ ] 6.0 Historical Trend Visualization (Line Charts)
  - [ ] 6.1 `[WIN]` Build `TemperatureChart.js` directly drawing a dynamic SVG line chart to map the historical data array, avoiding any third-party charting libraries.
  - [ ] 6.2 `[WIN]` Style the SVG paths (stroke, fill) to match the dark-mode aesthetic (e.g., distinct scalable lines).
  - [ ] 6.3 `[WIN]` Implement a segmented toggle control (1h, 5h, 24h) that triggers `fetchHistory()` and forces the SVG chart to re-render.
  - [ ] 6.4 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
- [ ] 7.0 Settings Panel & Global Error Handling UI
  - [ ] 7.1 `[WIN]` Implement `SettingsPanel.js` containing an interactive slider for the light threshold; POST changes to backend on adjustment.
  - [ ] 7.2 `[WIN]` Create an `ErrorBoundary.js` component wrapping the tree. On `componentDidCatch`, POST the error stack trace to the API.
  - [ ] 7.3 `[WIN]` Build an `ErrorLogModal.js` capable of fetching `/api/errors` and presenting a historical table of exceptions.
  - [ ] 7.4 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
- [ ] 8.0 Responsive Refinement & Final Testing
  - [ ] 8.1 `[WIN]` Write media queries in `index.css` to collapse the Dashboard grid into a single column for mobile viewports.
  - [ ] 8.2 `[RPI]` Perform manual validation: verify password block, test polling without page refreshes, and evaluate visual alert changes dynamically.
  - [ ] 8.3 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
- [ ] 9.0 Deployment Configuration & Handoff
  - [ ] 9.1 `[WIN]` Provide clear documentation/terminal output reminding the user what the configured authentication password is.
  - [ ] 9.2 `[WIN]` Remind the user of any remaining environment values, database URI changes, or API endpoint configurations needed for the production build.
  - [ ] 9.3 `[RPI]` Move changes to the dev server, verify with Browser Subagent, and check into git.
