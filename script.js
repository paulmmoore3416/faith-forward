document.addEventListener('DOMContentLoaded', function() {
    // Daily Scripture
    const scriptures = [
        "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope. - Jeremiah 29:11",
        "The Lord is my strength and my shield; in him my heart trusts, and I am helped; my heart exults, and with my song I give thanks to him. - Psalm 28:7",
        "Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go. - Joshua 1:9",
        "I can do all things through him who strengthens me. - Philippians 4:13",
        "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness. - Lamentations 3:22-23"
    ];

    const scriptureText = document.getElementById('scripture-text');
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    scriptureText.textContent = scriptures[dayOfYear % scriptures.length];

    // Weather Forecast
    const weatherWidget = document.getElementById('weather-widget');
    const apiKey = 'YOUR_API_KEY'; // Replace with your Weatherbit.io API key
    const zipCode = '63139';
    const weatherUrl = `https://api.weatherbit.io/v2.0/current?postal_code=${zipCode}&key=${apiKey}`;

    if (apiKey === 'YOUR_API_KEY') {
        weatherWidget.innerHTML = `<p>Please replace 'YOUR_API_KEY' in script.js with your Weatherbit.io API key to see the weather.</p>`;
    } else {
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                const weather = data.data[0];
                weatherWidget.innerHTML = `
                    <p><strong>${weather.city_name}, ${weather.state_code}</strong></p>
                    <p>${weather.temp}°F - ${weather.weather.description}</p>
                `;
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
                weatherWidget.innerHTML = `<p>Could not fetch weather data.</p>`;
            });
    }
});
