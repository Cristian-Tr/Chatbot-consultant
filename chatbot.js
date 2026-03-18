document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const windowChat = document.getElementById('chat-window');
    const trigger = document.getElementById('chat-trigger');

    window.step = "start";

    // --- FUNCȚIA PENTRU SUNETUL BUBBLE POP ---
    function playBubbleSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine'; 
            oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);

            setTimeout(() => { audioCtx.close(); }, 170);
        } catch (e) {
            console.log("Audio stins");
        }
    }

    // 1. START CHAT
    window.startWithChoice = function (choice) {
        playBubbleSound();
        toggleChat();
        processStep(choice);
    };

    // 2. LOGICA DECIZII UTILIZATOR
    window.processStep = function (choice) {
        const choiceLow = choice.toLowerCase();

        if (window.step === "start") {
            if (choiceLow === "da") {
                window.step = "project_type";
                addBotMessage("Ce include astăzi proiectul tău?", [
                    "ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"
                ]);
            } else {
                addBotMessage("Vă mulțumim frumos pentru vizită!");
                setTimeout(toggleChat, 3500);
            }
        }
        else if (window.step === "project_type") {
            let recomandare = "";
            if (choiceLow.includes("alei")) recomandare = "Pentru alei sau garaje, recomandăm **Beton clasa C12/15 (B200). <br> <br> Dacă dorești detalii suplimentare trimite-ne datele tale în secțiunea Contact și te vom ajuta cu drag!**";
            else if (choiceLow.includes("fundație")) recomandare = "Pentru fundație sau scară, recomandăm **Beton clasa C16/20 (B250). <br> <br> Dacă dorești detalii suplimentare trimite-ne datele tale în secțiunea Contact și te vom ajuta cu drag!**";
            else if (choiceLow.includes("placă")) recomandare = "Pentru placă sau centură, recomandăm **Beton clasa C16/20 (B250). <br> <br> Dacă dorești detalii suplimentare trimite-ne datele tale în secțiunea Contact și te vom ajuta cu drag!**";
            else if (choiceLow.includes("stâlpi")) recomandare = "Pentru stâlpi sau grinzi, recomandăm **Beton clasa C20/25 (B300). <br> <br> Dacă dorești detalii suplimentare trimite-ne datele tale în secțiunea Contact și te vom ajuta cu drag!**";
            else if (choiceLow.includes("zidărie")) recomandare = "Pentru zidărie sau tencuială, recomandăm **Ciment special și agregat fin 0-4 mm. <br> <br> Dacă dorești detalii suplimentare trimite-ne datele tale în secțiunea Contact și te vom ajuta cu drag!**";

            addBotMessage(recomandare);

            setTimeout(() => {
                window.step = "next_action";
                addBotMessage("Dorești să afli de unde poți cumpăra produsele noastre? <br> <br> Selectează te rog unul dintre produsele de mai jos:", ["CIMENT", "BETON", "AGREGATE"]);
            }, 3500); // TIMING INAINTE DE URMATOAREA INTREBARE
        }
        else if (window.step === "next_action") {
            let info = " Dacă dorești detalii suplimentare trimite-ne datele tale în secțiunea Contact și te vom ajuta cu drag!";
            addBotMessage(info);

            setTimeout(() => {
                window.step = "ask_restart";
                addBotMessage("Dorești detalii pentru alt proiect?", ["DA", "NU"]);
            }, 3500); // TIMING
        }
        else if (window.step === "ask_restart") {
            if (choiceLow === "da") {
                window.step = "project_type";
                addBotMessage("Ce include noul tău proiect?", ["ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"]);
            } else {
                addBotMessage("Îți mulțumim frumos pentru vizita de astăzi!");
                window.step = "start";
                setTimeout(toggleChat, 2500); // TIMING
            }
        }
    };

    // 3. FUNCTII INTERFATA
    function addBotMessage(text, options = []) {
        // ȘTERGERE MESAJ ANTERIOR INAINTE DE AFISAREA CELUI NOU
        clearChat(); 
        
        playBubbleSound();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'bot-msg';
        msgDiv.innerHTML = `<div>${text}</div>`;
        
        if (options.length > 0) {
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = opt;
                btn.onclick = () => {
                    playBubbleSound();
                    processStep(opt);
                };
                msgDiv.appendChild(btn);
            });
        }
        display.appendChild(msgDiv);
        display.scrollTop = 0; // RESETARE SCROLL LA INCEPUT
    }

    function clearChat() {
        display.innerHTML = '';
    }

    window.toggleChat = function () {
        const isHidden = (windowChat.style.display === 'none' || windowChat.style.display === '');
        windowChat.style.display = isHidden ? 'block' : 'none';
        trigger.style.display = isHidden ? 'none' : 'block';
        
        // DACA SE INCHIDE RESETAM CHATUL PENTRU DATA VIITOARE
        if (!isHidden) clearChat();
    };

    // 4. FUNCTIE URMARIRE CURSOR CU OCHII CATBOT-ULUI
    document.addEventListener('mousemove', (e) => {
        const irises = document.querySelectorAll(".iris");
        const x = (e.clientX * 100) / window.innerWidth + "%";
        const y = (e.clientY * 100) / window.innerHeight + "%";
        irises.forEach(iris => {
            iris.style.left = x;
            iris.style.top = y;
            iris.style.transform = `translate(-${x}, -${y})`;
        });
    });
});