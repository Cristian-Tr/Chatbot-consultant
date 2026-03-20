document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const windowChat = document.getElementById('chat-window');
    const trigger = document.getElementById('chat-trigger');
    const timeoutBar = document.getElementById('timeout-bar');

    let inactivityTimer = null;
    let progressInterval = null;
    const TIMEOUT_MS = 8000;
    window.step = "start";

    // --- 1. SUNET LA CLICK BUTOANE ---
    function playBubbleSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.08);
            gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.08);
            setTimeout(() => { audioCtx.close(); }, 350);
        } catch (e) { }
    }

    // --- 2. TIMEOUT ---
    function stopTimer() {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        if (progressInterval) clearInterval(progressInterval);
        if (timeoutBar) timeoutBar.style.width = "100%";
        inactivityTimer = null;
        progressInterval = null;
    }

    function startInactivityTimeout() {
        stopTimer();
        let timeLeft = TIMEOUT_MS;
        progressInterval = setInterval(() => {
            timeLeft -= 100;
            let widthPercent = (timeLeft / TIMEOUT_MS) * 100;
            if (timeoutBar) timeoutBar.style.width = widthPercent + "%";
        }, 100);

        inactivityTimer = setTimeout(() => {
            if (window.step === "start") {
                closeChatUI();
            } else {
                showWelcomeMenu();
            }
        }, TIMEOUT_MS);
    }

    // --- 3. AFIȘARE MESAJE ---
    function addBotMessage(text, options = []) {
        stopTimer();
        playBubbleSound();

        display.innerHTML = `
            <div class="typing-container">
                <div class="robot-thinking">🤖</div>
                <div class="typing-loader">
                    <span></span><span></span><span></span>
                </div>
            </div>`;

        setTimeout(() => {
            display.innerHTML = '';
            const msgDiv = document.createElement('div');
            msgDiv.className = 'bot-msg';
            msgDiv.innerHTML = `<div style="margin-bottom: 15px;">${text}</div>`;

            if (options && options.length > 0) {
                options.forEach((opt, index) => {
                    const btn = document.createElement('button');
                    btn.className = 'quiz-option';
                    btn.style.animation = `fadeInMsg 0.3s ease-out ${index * 0.1}s forwards`;
                    btn.style.opacity = "0";
                    btn.textContent = opt;
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        window.processStep(opt);
                    };
                    msgDiv.appendChild(btn);
                });
            }

            display.appendChild(msgDiv);
            display.scrollTop = display.scrollHeight;
            startInactivityTimeout();
        }, 1000);
    }

    // --- 4. LOGICA CONVERSAȚIEI ---
    function showWelcomeMenu() {
        window.step = "start";
        addBotMessage("🤖 <br> Bună! <br> Sunt consultantul tehnic CT <br> Vrei să te ajut să alegi produsele potrivite pentru proiectul tău?", ["DA", "NU"]);
    }

    window.processStep = function (choice) {
        const choiceLow = choice.toLowerCase().trim();

        if (window.step === "start") {
            if (choiceLow === "da") {
                window.step = "project_type";
                addBotMessage("🏗️ <br> Ce include astăzi proiectul tău?", [
                    "ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"
                ]);
            } else if (choiceLow === "nu") {
                addBotMessage("🤗 <br> Îți mulțumim frumos pentru vizită!  <br> <br> Dacă te răzgândești, ne găsești aici sau poți căuta singur produsele dorite! <br> <br> Mult succes cu proiectele tale!");
                setTimeout(closeChatUI, 4500);
            }
        }
        else if (window.step === "project_type") {
            let recomandare = "";
            if (choiceLow.includes("alei")) recomandare = "Pentru alei/garaje recomandăm: <br> <b>C12/15 (B200)</b>";
            else if (choiceLow.includes("fundație")) recomandare = "Pentru fundații recomandăm: <br> <b>C16/20 (B250)</b>";
            else if (choiceLow.includes("placă")) recomandare = "Pentru placă/centură recomandăm: <br> <b>C16/20 (B250)</b>";
            else if (choiceLow.includes("stâlpi")) recomandare = "Pentru stâlpi/grinzi recomandăm: <br> <b>C20/25 (B300)</b>";
            else if (choiceLow.includes("ziduri")) recomandare = "Pentru zidărie/tencuială recomandăm: <br> <b>Ciment special</b>";

            window.step = "product_selection";
            addBotMessage(`${recomandare} <br> <br> Vrei să afli de unde poți cumpăra produsele noastre? <br> Selectează un produs:`, ["CIMENT", "BETON", "AGREGATE", "CAUT ALTCEVA"]);
        }
        else if (window.step === "product_selection") {
            // REPARAT AICI: Verificăm dacă utilizatorul a ales "CAUT ALTCEVA"
            if (choiceLow.includes("caut altceva")) {
                addBotMessage("🤗 <br> Îți mulțumim frumos pentru că ai vizitat website-ul nostru! <br> <br> Mult succes cu proiectele tale!");
                setTimeout(closeChatUI, 3500);
            } else {
                window.step = "transport_step";
                addBotMessage("🏙️ <br> Poți cumpăra produsele noastre chiar din localitatea ta! <br> 📝 <br> Te rugăm să completezi datele tale în secțiunea Contact pentru a-ți oferi informații utile! <br> 🚚 <br> Ai nevoie de transport pentru produsele tale?", ["DA", "NU"]);
            }
        }
        else if (window.step === "transport_step") {
            window.step = "ask_restart";
            if (choiceLow === "da") {
                addBotMessage("📝 <br> Completează datele tale în secțiunea Contact pentru a-ți oferi informații despre serviciile noastre de transport marfă! <br> <br> 🏗️  <br> Dorești detalii pentru alt proiect?", ["DA", "NU"]);
            } else {
                addBotMessage("🤗 <br> Îți mulțumim frumos pentru vizită! <br> <br> 🏗️  <br> Dorești detalii pentru un alt proiect?", ["DA", "NU"]);
            }
        }
        else if (window.step === "ask_restart") {
            if (choiceLow === "da") {
                window.step = "project_type";
                addBotMessage("🏗️ <br> Ce include noul tău proiect?", ["ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"]);
            } else {
                addBotMessage("🤗 <br> Îți mulțumim frumos pentru că ai vizitat website-ul nostru! <br> <br> Mult succes cu proiectele tale!");
                setTimeout(closeChatUI, 2500);
            }
        }
    };

    // --- 5. CONTROL INTERFAȚĂ ---
    function openChatUI() {
        if (windowChat) windowChat.style.display = 'block';
        if (trigger) trigger.style.display = 'none';
        showWelcomeMenu();
    }

    function closeChatUI() {
        stopTimer();
        if (windowChat) windowChat.style.display = 'none';
        if (trigger) trigger.style.display = 'block';
        if (display) display.innerHTML = '';
        window.step = "start";
    }

    window.toggleChat = function () {
        if (!windowChat.style.display || windowChat.style.display === 'none') {
            openChatUI();
        } else {
            closeChatUI();
        }
    };

    window.startWithChoice = function (choice) {
        if (choice.toLowerCase() === 'da') {
            openChatUI();
        } else if (choice.toLowerCase() === 'nu') {
            openChatUI();
            window.processStep('NU');
        }
    };

    // --- 6. OCHI ---
    document.addEventListener('mousemove', (e) => {
        const irises = document.querySelectorAll(".iris");
        irises.forEach(iris => {
            const rect = iris.parentElement.getBoundingClientRect();
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
            const distance = Math.min(rect.width / 4, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 15);
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;
            iris.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        });
    });
});