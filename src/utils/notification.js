import { Notification } from 'element-ui'
let notificationInstance = null;
const resetNotifications = (options) => {
    if (notificationInstance) {
        notificationInstance.close()
    }
    notificationInstance = Notification(options)
}
['success', 'warning', 'info', 'error'].forEach(type => {
    resetNotifications[type] = options => {
        if(typeof options === 'string') {
            options = {
                message:options
            }
        }
        options.type = type
        return resetNotifications(options)
    }
})
export default resetNotifications