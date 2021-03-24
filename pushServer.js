/* Push server */

const webPush = require("web-push");
const pushServerKeys = require("./pushServerKeys.json");
const pushClientSubscription = require("./pushClientSubscription.json");

webPush.setVapidDetails(
  "mailto:vincent.chilot@gmail.com",
  pushServerKeys.publicKey,
  pushServerKeys.privateKey
);

const subscription = {
  endpoint: pushClientSubscription.endpoint,
  keys: {
    auth: pushClientSubscription.keys.auth,
    p256dh: pushClientSubscription.keys.p256dh,
  },
};

// TODO retrieve all users subscriptions and send the push notification to every user

// see https://github.com/web-push-libs/web-push for sendNotification API reference sendNotification(pushSubscription, payload, options)
webPush
  .sendNotification(subscription, "Notification sent from push node server")
  .then((res) => console.log("Push notification well send from Node", res))
  .catch((err) => console.error);
