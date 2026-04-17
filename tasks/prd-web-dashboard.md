# Office Command - Web Dashboard PRD

## Introduction / Overview
This document covers the UI Presentation Layer of the Office Command project. An interface built with React will serve as the user interface point. Because it shares a unified Node.js instance with the backend API, the compiled frontend files will be served directly by the project's core `server.js` locally.

## Development Environment & Source Control
*   **Directory:** The web dashboard should be developed on the dev server in the `/home/bvanbeynum/dev/officecommand` directory.
*   **Git:** Git is initialized in the folder, so all git commands must be run in that directory.
*   **Source Location:** Because both the frontend and backend strictly share the identical Node.js server instance, React source code should be kept in a sub-folder (e.g., `/frontend`), but the final compiled static build will be hosted and routed by the fundamental `server.js`.

## Goals
*   Display real-time and historical sensor telemetry in an intuitive, premium interface.
*   Provide settings controls allowing the user to configure variables (like light thresholds).
*   Enforce access control using a simple password barrier.

## Design Considerations
*   **Aesthetic Requirements:** Implement a premium, rich dark-mode aesthetic utilizing harmonious color palettes and sleek typography. Avoid basic/generic colors. Use smooth gradients and dynamic micro-animations (e.g., hover effects on buttons/cards).
*   **Responsive Design:** The dashboard UI must be fully responsive and support both desktop and mobile layouts seamlessly.
*   **Structure:** As per global engineering rules, avoid unnecessary routing unless duplicating code occurs. Utilize functional components uniquely assembled on a single main dashboard page.
*   **UI Components:**
    *   Distinct "Live Monitoring" metric cards for Temperature, Humidity, Light, and Door state.
    *   Dynamic line charts displaying a 24-hour style temperature trend.
    *   Settings panel containing a slider input to define the acceptable "Light Threshold."
    *   **System Health / Error Log Panel:** A dedicated section or modal to display historical errors fetched from the database, allowing visibility into backend and frontend failures.

## REST API Integration Specifications
The dashboard will consume the standard JSON API format `{ "success": ..., "data": ..., "error": ... }`.
*   **Polling:** Automatically perform an HTTP `GET` request to `/api/sensors/current` every 10 seconds.
*   **History Fetching:** Perform an HTTP `GET` request to `/api/sensors/history?timeframe=[selected]` when the user toggles the chart's timeline controller (1h, 5h, 24h).
*   **Updates:** Perform an HTTP `POST` to `/api/settings` to persist light threshold slider changes to backend logic if necessary.
*   **Error Management:** Perform an HTTP `GET` to `/api/errors` to populate the error log UI. Utilize HTTP `POST` to `/api/errors` to programmatically save any unhandled frontend exceptions to the database.

## Functional Requirements
1.  **Framework:** Must use React.js (Functional Components, Hooks exclusively). Webpack should be used for distinct dev/prod builds. No Tailwind CSS unless strictly explicitly authorized; prefer Vanilla CSS for style definitions.
2.  **State Management:** Utilize `useState/useEffect` properly. Avoid prop-drilling; use React Context if global state is required for telemetry.
3.  **Visual Alerts:** The dashboard state must evaluate the `door_open` boolean and the `light` raw integer (compared against the Settings slider threshold). It must dynamically display visual UI changes (color change, alerts, or icon differences) when the door is OPEN and when the light is classified as ON.
4.  **Security Constraint:** On initial component mount, prompt the user for a simple password. Do not fetch or display data until the correct phrase is matched.
5.  **Error Handling & Visualization:** The app must implement a global error handler (or Error Boundary) to catch UI crashes and push the error string to the database via API. It must also provide mechanisms to render the retrieved database error logs for user review.

## Testing Plan
*   **Component Mounting Validation:** Open the root page and verify the password prompt blocks data.
*   **Live Update Verification:** Trigger dummy data in the DB to verify the 10-second polling updates the UI without requiring a full page refresh.
*   **State Alert Evaluation:** Modify dummy `door_open` values to `true` and verify the UI properly renders an alert state. Adjust the light threshold slider past the current raw light value and verify the specific visual "Light ON" treatment activates.
*   **Timeframe Toggling:** Switch the chart view between 1 hr, 5 hrs, and 24 hrs to verify the correct API parameters are called and the chart updates cleanly.
