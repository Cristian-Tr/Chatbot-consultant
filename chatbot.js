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
        addBotMessage(" <br> ℹ️ <br> Dorești să afli informații despre produse sau servicii necesare pentru finalizarea cu succes a proiectului tău? <br> 🏡🏢🏦 <br><br> ", ["DA", "NU"]);
    }

    window.processStep = function (choice) {
        const choiceLow = choice.toLowerCase().trim();

        if (window.step === "start") {
            if (choiceLow === "da") {
                window.step = "project_type";
                addBotMessage("<br> 🏗️ <br> Ce include proiectul tău?", [
                    "ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"
                ]);
            } else if (choiceLow === "nu") {
                addBotMessage("<br> 🤗 <br> Îți mulțumim frumos pentru că ai vizitat website-ul nostru! <br> <br> ℹ️ <br> Dacă vei avea nevoie pe viitor de informații despre produse sau servicii pentru proiectele tale, ne găsești aici!! <br> 🏡🏢🏦 <br><br> MULT SUCCES!");
                setTimeout(closeChatUI, 7100);
            }
        }
        else if (window.step === "project_type") {
            let recomandare = "";
            if (choiceLow.includes("alei")) recomandare = "Pentru alei/garaje recomand: <br> <b>C12/15 (B200)</b>";
            else if (choiceLow.includes("fundație")) recomandare = "Pentru fundații recomand: <br> <b>C16/20 (B250)</b>";
            else if (choiceLow.includes("placă")) recomandare = "Pentru placă/centură recomand: <br> <b>C16/20 (B250)</b>";
            else if (choiceLow.includes("stâlpi")) recomandare = "Pentru stâlpi/grinzi recomand: <br> <b>C20/25 (B300)</b>";
            else if (choiceLow.includes("ziduri")) recomandare = "Pentru zidărie/tencuială recomand: <br> <b>Ciment special</b>";

            window.step = "products_selection";
            addBotMessage(`${recomandare} <br> Dorești detalii despre unul din produsele de mai jos? <br> Selectează un produs: <br> `, ["CIMENT", "BETON", "MORTAR", "AGREGATE", "CAUT ALTCEVA"]);
        }
        else if (window.step === "products_selection") {
            if (choiceLow.includes("caut altceva")) {
                addBotMessage("<br> 🤗 <br> Îți mulțumim frumos pentru că ai vizitat website-ul nostru! <br> <br> Dacă vei avea nevoie pe viitor de produse sau servicii pentru proiectele tale, ne găsești aici! <br> <br> 👍 <br><br> MULT SUCCES!");
                setTimeout(closeChatUI, 4500);
            } else {
                window.step = "services_step";
                addBotMessage("📝 <br> Completează formularul de Contact pt. a primi info solicitate! <br> Dorești detalii despre unul din serviciile de mai jos? <br> Selectează un serviciu: <br> ", ["PROIECTARE", "SUPORT", "TRANSPORT", "ÎNCHIRIERE", "CAUT ALTCEVA"]);
            }
        }
        else if (window.step === "services_step") {
            window.step = "ask_restart";
           if (choiceLow === "caut altceva") {
                addBotMessage("<br> 🤗 <br> Îți mulțumim frumos pentru că ai vizitat website-ul nostru! <br> <br> ℹ️ <br> Dorești detalii pentru un alt proiect?", ["DA", "NU"]);
            }
            else  {
                addBotMessage("📝 <br> Completează formularul de Contact pt. a primi info solicitate! <br> <br> ℹ️ <br> Dorești detalii pentru alt proiect?", ["DA", "NU"]);
            } 
        }
        else if (window.step === "ask_restart") {
            if (choiceLow === "da") {
                window.step = "project_type";
                addBotMessage("<br> 🏗️ <br> Ce include noul tău proiect?", ["ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"]);
            } else {
                addBotMessage("<br> ℹ️ <br> Dacă vei avea nevoie pe viitor de informații despre produse sau servicii necesare pentru proiectele tale, ne găsești aici! <br> 🏡🏢🏦 <br><br> MULT SUCCES!");
                setTimeout(closeChatUI, 4500);
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
});