import PushNotifications from "@pusher/push-notifications-server"


import notifyBasedOnInterest from "./notifyBasedOnInterests"
import notifyIndividuals from "./notifyIndividuals"


export default {
    notifyBasedOnInterest: notifyBasedOnInterest(PushNotifications),
    notifyIndividuals: notifyIndividuals(PushNotifications),
}