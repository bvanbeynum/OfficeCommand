# Task List Management

Guidelines for managing task lists in markdown files to track progress on completing a PRD.

## Environment & Execution
- **Master Branch Workflow:** This is a single-user environment. All development occurs directly on the `master` (or `main`) branch. 
- **Docker Usage:** The web application is simple Node.js and does not need custom containers. Use the latest Node.js docker container. Example patterns:
	- *Dev:* `docker run --rm --name <app>dev --network host -e TZ=America/New_York -d -w /usr/src/web -v /path/to/project:/usr/src/web node:latest npm run dev`
	- *Test:* `docker run --rm -it --network host -e TZ=America/New_York -w /usr/src/web -v /path/to/project:/usr/src/web node:latest npm run test`
	- *Build:* `docker run --rm -it -w /usr/src/web -v /path/to/project:/usr/src/web node:latest npm run build`

## Task Implementation & AI Testing
- **Autonomous Browser Testing:** The AI must use its **Browser Subagent** tool to launch a browser and independently validate any web UI modifications. Do *not* wait for the user to perform basic UI validations.
- **One sub-task at a time:** Do **NOT** start the next sub‑task until the previous is fully completed, tested autonomously, and you have explicitly asked the user for permission to move on.
- **Completion protocol:**  
	1. Complete local code -> run docker testing locally -> use browser subagent to test.
	2. Mark sub‑task completed by changing `[ ]` to `[x]`.
	3. Once all subtasks underneath a parent task are `[x]`, provide a single-line git commit command for the root project directly targeting the master branch. Example:
		```bash
		git commit -m "feat: added login page" -m "- wired up mongo auth" -m "- passed browser subagent UI testing" 
		```

## Task List Maintenance
1. **Update the task list as you work:** Mark tasks and subtasks successfully tested as completed (`[x]`). Add missing tasks as they emerge.
2. **Maintain the "Relevant Files" section:** Keep a running list of every file created or modified and its purpose.

## AI Instructions
1. Always test web changes yourself via the browser subagent.
2. Once a logical chunk of subtasks finishes, present the `git commit -m...` string to the user.
3. Stop after each sub‑task and wait for the user's go‑ahead before writing the next piece.
