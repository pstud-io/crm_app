This contains changes made in the android/ios native directories or the app.json/eas.json files which are essential for managing the project during expo sdk version upgrades.

Have also implemented CNG from expo to ensure that android/ios directories are not needed to be edited. If they appear in git repository then they have been edited cause somewhere CGN was not implementable.

Sentry setup done as of 03/07/2026. Need to add .env.local file to project with sentry api key for sentry to work. API key will be available in Sentry project named "Pipeline" in organization "ProjectStduio". Sentry login can be done via google login (admin@projectstudio.ai)
