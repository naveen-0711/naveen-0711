document.addEventListener('DOMContentLoaded', function() {
    // Example rainfall data (in mm)
    let rainfallAmount = 120; // This value would come from an API in a real scenario
    const rainfallThreshold = 100; // Define your threshold

    function showNotification() {
        const notification = document.getElementById('notification');
        notification.style.display = 'block';

        // Hide the notification after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    if (rainfallAmount > rainfallThreshold) {
        showNotification();
    }
});
