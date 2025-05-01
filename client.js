function connect() {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        console.log('Connected to server');
        ws.send("connect")
    };

    ws.onmessage = (event) => {
        // Update cookie count display
        const cookiesDiv = document.getElementById('cookies');
        cookiesDiv.textContent = `Cookies: ${event.data}`;
    
        // Optional: still log messages if needed
        const messages = document.getElementById('messages');
        const newMessage = document.createElement('div');
        newMessage.textContent = `Updated to: ${event.data}`;
        messages.appendChild(newMessage);
    };
    

    ws.onclose = () => {
        console.log('Disconnected. Reconnecting...');
        setTimeout(connect, 1000);
    };

    document.getElementById('send').onclick = () => {
        ws.send("increment");
    
        // Animate main cookie image
        const img = document.querySelector('#send img');
        img.classList.add('cookie-pop');
        img.addEventListener('animationend', () => {
            img.classList.remove('cookie-pop');
        }, { once: true });
    
        // Create flying cookies (e.g., 5)
        for (let i = 0; i < 10; i++) {
            const mini = document.createElement('img');
            mini.src = "Cookie.png"; // reuse same image
            mini.className = 'flying-cookie';
    
            // Random direction offsets
            const dx = (Math.random() - 0.5) * 600 + 'px';
            const dy = (Math.random() - 0.5) * 600 + 'px';
            mini.style.setProperty('--dx', dx);
            mini.style.setProperty('--dy', dy);
    
            // Place in center of cookie button
            const btn = document.getElementById('send');
            const rect = img.getBoundingClientRect();
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            // Set starting position at center of cookie image
            mini.style.left = rect.left + rect.width / 2 + scrollX + 'px';
            mini.style.top = rect.top + rect.height / 2 + scrollY + 'px';
            mini.style.position = 'absolute';
    
            document.body.appendChild(mini);
    
            // Remove after animation
            setTimeout(() => mini.remove(), 800);
        }
    };
    
    
}

connect();