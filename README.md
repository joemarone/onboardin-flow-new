diff --git a/README.md b/README.md
index 58beeaccd87e230076cab531b8f418f40b6d1aeb..8fccafc8bce1bc4bf01c7788fc724d8ddd6b98cd 100644
--- a/README.md
+++ b/README.md
@@ -1,70 +1,38 @@
-# Getting Started with Create React App
+# Alpha Sales Flow
 
-This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
+Alpha Sales Flow is a React application that helps track new families through the Alpha Anywhere onboarding pipeline. Advisors can add customers, monitor progress through key milestones, and send tailored emails from editable templates.
 
-## Available Scripts
+## Features
+- Add customers with parent and student information, start dates, and advisor assignments
+- Track onboarding status across multiple steps with at-a-glance counts
+- Sort and search the pipeline by customer, student, or status
+- Send predefined email templates (confirmation, ESA tips, enrollment welcome, parent support) and customize them in-app
+- View a timeline of actions for each customer, including sent emails and completed steps
 
-In the project directory, you can run:
+## Local Development
+This project is bootstrapped with [Create React App](https://create-react-app.dev/). To run the app locally:
 
-### `npm start`
+1. Install dependencies:
+   ```bash
+   npm install
+   ```
+2. Start the development server:
+   ```bash
+   npm start
+   ```
+   The app will be available at [http://localhost:3000](http://localhost:3000) and reload on code changes.
 
-Runs the app in the development mode.\
-Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
+## Testing
+Run the test suite once using:
 
-The page will reload when you make changes.\
-You may also see any lint errors in the console.
+```bash
+npm test -- --watchAll=false
+```
 
-### `npm test`
+## Production Build
+Create an optimized build for deployment:
 
-Launches the test runner in the interactive watch mode.\
-See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
+```bash
+npm run build
+```
 
-### `npm run build`
-
-Builds the app for production to the `build` folder.\
-It correctly bundles React in production mode and optimizes the build for the best performance.
-
-The build is minified and the filenames include the hashes.\
-Your app is ready to be deployed!
-
-See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
-
-### `npm run eject`
-
-**Note: this is a one-way operation. Once you `eject`, you can't go back!**
-
-If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
-
-Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.
-
-You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
-
-## Learn More
-
-You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
-
-To learn React, check out the [React documentation](https://reactjs.org/).
-
-### Code Splitting
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
-
-### Analyzing the Bundle Size
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
-
-### Making a Progressive Web App
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
-
-### Advanced Configuration
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
-
-### Deployment
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)
-
-### `npm run build` fails to minify
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
