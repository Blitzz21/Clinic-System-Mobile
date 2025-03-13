// Initialize chart
const ctx = document.getElementById('visitsChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [{
            data: [4, 6, 8, 7, 9, 10],
            backgroundColor: 'rgba(37, 99, 235, 0.7)',
            borderColor: 'rgb(37, 99, 235)',
            borderWidth: 1,
            barThickness: 16,
            barWidth: 10,
            borderRadius: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false,
                beginAtZero: true,
                max: 12
            }
        }
    }
});

// Tab switching functionality
function switchTab(tabId) {
    const tabs = ['dashboard', 'account', 'notification'];
    tabs.forEach(tab => {
        const element = document.getElementById(tab);
        const tabButton = document.getElementById(`${tab}-tab`);
        
        if (tab === tabId) {
            // Show the active tab with slide-in animation
            element.classList.remove('slide-out');
            element.classList.add('slide-in');
            element.style.display = 'block'; // Ensure it's visible
            tabButton.classList.remove('text-gray-700');
            tabButton.classList.add('text-white', 'bg-blue-600');
        } else {
            // Hide the inactive tab with slide-out animation
            element.classList.remove('slide-in');
            element.classList.add('slide-out');
            tabButton.classList.remove('text-white', 'bg-blue-600');
            tabButton.classList.add('text-gray-700');

            // Delay the removal of the element from the DOM
            setTimeout(() => {
                element.style.display = 'none'; // Hide the element after animation
                element.classList.remove('slide-out'); // Clean up class
            }, 300); // Match this duration with your CSS animation duration
        }
    });
}

// Initialize dashboard as active tab
switchTab('dashboard');