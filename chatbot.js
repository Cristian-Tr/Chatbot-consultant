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
            oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.08);
            
            gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.08);

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
                addBotMessage("🏗️ <br> Ce include astăzi proiectul tău?", [
                    "ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"
                ]);
            } else {
                addBotMessage("<br> <br> 🤗 <br> Îți mulțumim frumos pentru că ai vizitat astăzi pagina noastră!");
                setTimeout(toggleChat, 5300);
            }
        }
        else if (window.step === "project_type") {
            let recomandare = "";
            if (choiceLow.includes("alei")) recomandare = "Pentru alei sau garaje, recomandăm: <br> <br>  Beton clasa C12/15 (B200) <br> <br> 📋 <br> Dacă dorești detalii suplimentare completează datele tale în formularul din secțiunea Contact și noi te vom ajuta cu drag!";
            else if (choiceLow.includes("fundație")) recomandare = "Pentru fundație sau scară, noi îți recomandăm: <br> <br>  Beton clasa C16/20 (B250). <br> <br> 📋 <br> Dacă dorești detalii suplimentare completează datele tale în formularul din secțiunea Contact și noi te vom ajuta cu drag!";
            else if (choiceLow.includes("placă")) recomandare = "Pentru placă sau centură, noi îți recomandăm: <br> <br>  Beton clasa C16/20 (B250). <br> <br> 📋 <br> Dacă dorești detalii suplimentare completează datele tale în formularul din secțiunea Contact și noi te vom ajuta cu drag!";
            else if (choiceLow.includes("stâlpi")) recomandare = "Pentru stâlpi sau grinzi, noi îți recomandăm: <br> <br>  Beton clasa C20/25 (B300). <br> <br> 📋 <br> Dacă dorești detalii suplimentare completează datele tale în formularul din secțiunea Contact și noi te vom ajuta cu drag!";
            else if (choiceLow.includes("zidărie")) recomandare = "Pentru zidărie sau tencuială, noi îți recomandăm: <br> <br>  Ciment special și agregat fin 0-4 mm. <br> <br> 📋 <br> Dacă dorești detalii suplimentare completează datele tale în formularul din secțiunea Contact și noi te vom ajuta cu drag!";

            addBotMessage(recomandare);

            setTimeout(() => {
                window.step = "next_action";
                addBotMessage("Dorești să afli de unde poți achiziționa produsele noastre? <br> <br> Selectează te rog unul dintre produsele din lista de mai jos:", ["CIMENT", "BETON", "AGREGATE"]);
            }, 5300); // TIMING INAINTE DE URMATOAREA INTREBARE
        }
        else if (window.step === "next_action") {
            let info = " Poți achiziționa produsele noastre chiar din localitatea ta. <br> <br> 📋 <br> Te rugăm să completezi datele tale în formularul din secțiunea Contact și noi te vom ajuta cu drag să afli toate detaliile!";
            addBotMessage(info);

            setTimeout(() => {
                window.step = "ask_restart";
                addBotMessage("🏗️ <br> Dorești detalii pt. alt proiect?", ["DA", "NU"]);
            }, 5300); // TIMING
        }
        else if (window.step === "ask_restart") {
            if (choiceLow === "da") {
                window.step = "project_type";
                addBotMessage("🏗️ <br> Ce include noul tău proiect?", ["ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"]);
            } else {
                addBotMessage("Îți mulțumim frumos pentru că ai vizitat astăzi pagina noastră! <br> <br> Dacă mai ai nevoie de alte materiale pentru proiectele tale ne găsești aici. <br> <br> 🤗 <br> Te așteptăm cu drag să ne vizitezi din nou!");
                window.step = "start";
                setTimeout(toggleChat, 4400); // TIMING
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