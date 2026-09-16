# Deploying saviourwebsite.online

The project is now configured for same-origin production API calls and Express serves `website.html` at `/`.

Required hosting steps:

1. Deploy this folder to a Node.js host with persistent disk storage.
2. Set the custom domain to `saviourwebsite.online` in that host's dashboard.
3. Point the domain DNS records to the host as instructed by the host.
4. Add the production environment values from `.env.example`, including a strong `JWT_SECRET`, SMTP credentials, and approved payment-provider credentials.
5. Start with `npm start` and confirm `https://saviourwebsite.online/api/health` returns status `ok`.

The domain cannot be published from this workspace because DNS/hosting access and provider credentials are not available here.