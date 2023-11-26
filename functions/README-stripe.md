# Configuration

```
firebase init functions --project PROJECT_ID_OR_ALIAS
firebase functions:config:set stripe.secret_key="YOUR_STRIPE_SECRET_KEY"
firebase functions:config:set stripe.site_url="https://[PROJECT_ID].web.app" // replace with actual front-end site URL
```

# Testing

```
firebase functions:config:get > functions/.runtimeconfig.json // file must be in functions dir
firebase emulators:start --only functions
```

# Deployment

```
firebase deploy --only functions
```
