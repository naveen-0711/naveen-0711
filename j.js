// Your Supabase URL and Key
const SUPABASE_URL = 'https://qnbkxkquabxmbdakdwbg.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYmt4a3F1YWJ4bWJkYWtkd2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyODA0NTEsImV4cCI6MjAzODg1NjQ1MX0.sl7F0_SVKAsgQwwuDwB6cCHM7cfXU372jpJeG28Blnk'; // Replace with your Supabase Key

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', function() {
    const sosForm = document.getElementById('sos-form');
    const updatesList = document.getElementById('updates-list');
    const toast = document.getElementById('toast');

    // Mock function to simulate sending an SOS alert
    function sendSOSAlert(name, location, message) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: 'success', data: { name, location, message, timestamp: new Date().toLocaleTimeString() } });
            }, 1000);
        });
    }

    // Append values to Supabase
    async function appendToSupabase(name, location, message) {
        const { data, error } = await supabase
            .from('sos_main')
            .insert([{ name: name, location: location, message: message }]);

        if (error) {
            console.error('Error inserting data:', error);
            return { status: 'error' };
        }

        return { status: 'success' };
    }

    sosForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const location = document.getElementById('location').value;
        const message = document.getElementById('message').value;

        // Send SOS alert and append the data to Supabase
        sendSOSAlert(name, location, message).then(response => {
            if (response.status === 'success') {
                showToast('SOS Alert Sent Successfully!');
                
                // Append data to Supabase
                appendToSupabase(name, location, message).then(result => {
                    if (result.status === 'success') {
                        // Add the alert to the updates list
                        const alertItem = document.createElement('li');
                        alertItem.textContent = `SOS Alert from ${response.data.name} at ${response.data.location}: ${response.data.message} (Sent at ${response.data.timestamp})`;
                        updatesList.appendChild(alertItem);
                    } else {
                        showToast('Failed to save data. Please try again.', true);
                    }
                });
            } else {
                showToast('Failed to send SOS alert. Please try again.', true);
            }
        });
    });

    // Fetch and display updates when the page loads
    function fetchUpdates() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { message: 'Update 1: Emergency responders are on their way.', timestamp: new Date().toLocaleTimeString() },
                    { message: 'Update 2: Temporary shelters are being set up at Location X.', timestamp: new Date().toLocaleTimeString() },
                ]);
            }, 1000);
        });
    }

    fetchUpdates().then(updates => {
        updates.forEach(update => {
            const updateItem = document.createElement('li');
            updateItem.textContent = `${update.message} (Received at ${update.timestamp})`;
            updatesList.appendChild(updateItem);
        });
    });

    // Function to show toast notifications
    function showToast(message, isError = false) {
        toast.textContent = message;
        toast.style.backgroundColor = isError ? '#ff4d4d' : '#333';
        toast.className = 'show';
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }
});
