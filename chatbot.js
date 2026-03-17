document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const windowChat = document.getElementById('chat-window');
    const trigger = document.getElementById('chat-trigger');

    window.step = "start";

    // 1. Funcția care pornește chat-ul doar prin butoanele DA/NU de pe trigger
    window.startWithChoice = function (choice) {
        toggleChat();
        addUserMessage(choice);
        processStep(choice);
    };

    // 2. Logica principală de decizie (Decision Tree)
    window.processStep = function (choice) {
        const choiceLow = choice.toLowerCase();

        // PASUL 1: Start
        if (window.step === "start") {
            if (choiceLow === "da") {
                window.step = "project_type";
                addBotMessage("Ce include proiectul tău?", [
                    "ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"
                ]);
            } else {
                addBotMessage("Vă mulțumim frumos pentru că ne-ați vizitat!! Dacă vă răzgândiți, sunt aici.");
                // Închidem automat după un scurt mesaj de refuz
                setTimeout(toggleChat, 2518);
            }
        }
        // PASUL 2: Selecție tip proiect
        else if (window.step === "project_type") {
            let recomandare = "";
            if (choiceLow.includes("alei")) recomandare = "Pentru alei sau garaje, recomandăm **Beton clasa C12/15 (B200) și agregat grosier 8-16 mm.**";
            else if (choiceLow.includes("fundație")) recomandare = "Pentru fundație sau scară, recomandăm **Beton clasa C16/20 (B250) și agregat grosier 4-8 mm.**";
            else if (choiceLow.includes("placă")) recomandare = "Pentru placă sau centură, recomandăm **Beton clasa C16/20 (B250) și agregat grosier 4-8 mm.**";
            else if (choiceLow.includes("stâlpi")) recomandare = "Pentru stâlpi sau grinzi, recomandăm **Beton clasa C20/25 (B300) și agregat grosier 8-16 mm.**";
            else if (choiceLow.includes("zidărie")) recomandare = "Pentru zidărie sau tencuială, recomandăm **Ciment pentru zidărie și tencuială și agregat fin 0-4 mm.**";

            addBotMessage(recomandare);

            // Trecem la întrebarea despre locație
            setTimeout(() => {
                window.step = "next_action";
                addBotMessage("Dorești să afli unde poți găsi produsele noastre?", ["CIMENT", "BETON", "AGREGATE"]);
            }, 88);
        }
        // PASUL 3: Direcționare către Contact
        else if (window.step === "next_action") {
            let info = "";
            if (choiceLow.includes("ciment")) info = "Poți cumpăra ciment din magazinele și depozitele cu materiale de construcții din localitatea ta! Trimite-ne te rog datele tale în secțiunea Contact și te vom contacta noi pentru a-ți oferi detalii suplimentare!";
            else if (choiceLow.includes("beton")) info = "Poți cumpăra betonul dorit din stațiile noastre de betoane. Trimite-ne te rog datele tale în secțiunea Contact și te vom contacta noi pentru a-ți oferi detalii suplimentare!";
            else if (choiceLow.includes("agregate")) info = "Poți cumpăra agregate din stațiile noastre de concasare. Trimite-ne te rog datele tale în secțiunea Contact și te vom contacta noi pentru a-ți oferi detalii suplimentare!";

            addBotMessage(info);

            // Întrebarea de restart finală
            setTimeout(() => {
                window.step = "ask_restart";
                addBotMessage("Doriți detalii pentru alt proiect?", ["DA", "NU"]);
            }, 4444);
        }
        // PASUL 4: Restart sau Final
        else if (window.step === "ask_restart") {
            if (choiceLow === "da") {
                clearChat();
                window.step = "project_type";
                addBotMessage("Ce include proiectul tău?", [
                    "ALEI/GARAJE", "FUNDAȚIE/SCARĂ", "PLACĂ/CENTURĂ", "STÂLPI/GRINZI", "ZIDURI/TENCUIELI"
                ]);
            } else {
                addBotMessage("Vă mulțumim frumos pentru că ne-ați vizitat!");
                window.step = "start";
                setTimeout(toggleChat, 2518);
            }
        }
    };

    // 3. Funcții utilitare pentru interfață
    function addBotMessage(text, options = []) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'bot-msg';
        msgDiv.innerHTML = `<div>${text}</div>`;
        if (options.length > 0) {
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = opt;
                btn.onclick = () => {
                    addUserMessage(opt);
                    processStep(opt);
                };
                msgDiv.appendChild(btn);
            });
        }
        display.appendChild(msgDiv);
        display.scrollTop = display.scrollHeight;
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'user-msg';
        msgDiv.textContent = text;
        display.appendChild(msgDiv);
        display.scrollTop = display.scrollHeight;
    }

    function clearChat() {
        display.innerHTML = '';
    }

    window.toggleChat = function () {
        const isHidden = (windowChat.style.display === 'none' || windowChat.style.display === '');
        windowChat.style.display = isHidden ? 'block' : 'none';
        trigger.style.display = isHidden ? 'none' : 'block';
    };

    // 4. Urmărire Cursor (Ochi)
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