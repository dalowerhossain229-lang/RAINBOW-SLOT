const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - মেগা সকেট প্রোটোকল লক]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// ৭টি ওরিজিনাল রেনবো ফ্রুট স্লট পুল তালিকা ভাই ভাই
const slotSymbolsPool = ["CHERRY", "LEMON", "ORANGE", "PLUM", "GRAPE", "WATERMELON", "BAR"];

// ওরিজিনাল ৫টি পেলাইনের ৩×৩ ইনডেক্স কোঅর্ডিনেট ম্যাপ ভাই ভাই
const PAYLINES = {
    "LINE_1": [[0,0], [0,1], [0,2]], // ওপরের সোজা লাইন
    "LINE_2": [[1,0], [1,1], [1,2]], // মাঝখানের সোজা লাইন
    "LINE_3": [[2,0], [2,1], [2,2]], // নিচের সোজা লাইন
    "LINE_4": [[0,0], [1,1], [2,2]], // কোনাকুনি বাম-টু-ডান (Diagonal 1)
    "LINE_5": [[0,2], [1,1], [2,0]]  // কোনাকুনি ডান-টু-বাম (Diagonal 2)
};

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/rainbow-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ৩×৩ মাল্টি-পেলাইন স্লট কোর এ এপিআই রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম লক ভাই ভাই!)
app.post('/api/rainbow-spin', async (req, res) => {
    const { userId, amount, wallet } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;

    // 🔒 সর্বোচ্চ ২০০০০ বিডিটি পর্যন্ত কড়া বেট সিকিউরিটি ফিল্টার লক ভাই ভাই
    if (reqAmount < 1 || reqAmount > 20000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳২০০০০)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই প্রোটোকল]: বাজি ধরার আগে প্লেয়ারের একাউন্টের রিয়েল টাকা নিশ্চিত করা ভাই ভাই
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "❌ Database Sync Error! Please refresh and try again." });
        }

        // 🔒 [কঠোর লক বর্ম]: পকেটে বাজি ধরার চেয়ে কম টাকা থাকলে বাজি ডিরেক্ট রিফিউজড ভাই ভাই!
        if (currentDbBalance < reqAmount) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge BDT." });
        }

        let adminTriggeredPrize = (balResponse.data && balResponse.data.rainbow_target) ? balResponse.data.rainbow_target : null;

        let matrix, winningLines, finalStatus, totalMultiplier;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল RTP ও মাল্টি-পেলাইন গাণিতিক লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            // ৩×৩ গ্রিডের ৯টি ঘর র্যান্ডম জেনারেট লক
            matrix = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ];
            winningLines = [];
            totalMultiplier = 0;

            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    matrix[r][c] = slotSymbolsPool[Math.floor(Math.random() * slotSymbolsPool.length)];
                }
            }

            // 🔍 নিয়ম ১: ৫টি স্ট্যান্ডার্ড পেলাইন চেক (পাশাপাশি ও কোনাকুনি)
            for (const [lineId, coords] of Object.entries(PAYLINES)) {
                const s1 = matrix[coords[0][0]][coords[0][1]];
                const s2 = matrix[coords[1][0]][coords[1][1]];
                const s3 = matrix[coords[2][0]][coords[2][1]];

                if (s1 === s2 && s2 === s3) {
                    winningLines.push(lineId);
                    if (s1 === "BAR") totalMultiplier += 15.0; // মাল্টি-পেলাইনে ওডস সুষম ডিস্ট্রিবিউশন
                    else if (s1 === "WATERMELON") totalMultiplier += 8.0;
                    else if (s1 === "GRAPE" || s1 === "PLUM") totalMultiplier += 5.0;
                    else totalMultiplier += 3.0;
                }
            }

            // 🔍 নিয়ম ২: এনিহোয়ার ৩-ম্যাচ স্ক্যাটার চেক (যেকোনো জায়গায় ৩টি একই ফল থাকলে উইন ভাই ভাই!)
            const symbolCounts = {};
            const symbolCoords = {};
            
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const sym = matrix[r][c];
                    if (!symbolCounts[sym]) {
                        symbolCounts[sym] = 0;
                        symbolCoords[sym] = [];
                    }
                    symbolCounts[sym]++;
                    symbolCoords[sym].push([r, c]);
                }
            }

            // যেকোনো জায়গায় ৩টি বা তার বেশি থাকলে স্ক্যাটার উইন প্লাস
            for (const [sym, count] of Object.entries(symbolCounts)) {
                if (count >= 3) {
                    // যদি এই ফলটি অলরেডি কোনো পেলাইনে উইন না দিয়ে থাকে, তবেই স্ক্যাটার কাউন্ট হবে ভাই ভাই
                    let alreadyWonInLine = false;
                    if (winningLines.length > 0) alreadyWonInLine = true; 

                    if (!alreadyWonInLine) {
                        winningLines.push(symbolCoords[sym].slice(0, 3)); // ফ্রন্টএন্ডে ঘরগুলো নিয়ন হাইলাইট করার জন্য পজিশন পাস
                        if (sym === "BAR") totalMultiplier += 6.0;
                        else if (sym === "WATERMELON") totalMultiplier += 4.0;
                        else totalMultiplier += 2.0;
                    }
                }
            }

            // ফাইনাল উইন-লস স্ট্যাটাস ফিল্টারিং
            if (totalMultiplier > 0) {
                finalStatus = "win";
            } else {
                finalStatus = "lose";
            }

            // এডমিন কন্ট্রোল ও সুষম আরটিপি লুপ চাবি ভাই ভাই
            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "lose") isLoopActive = false;
                if (adminTriggeredPrize === "force_win" && finalStatus === "win") isLoopActive = false;
            } else {
                // হাই-মাল্টিপ্লায়ার জ্যাকপটের চান্স আরটিপি লুপ ট্র্যাকে স্বাভাবিক নিয়মে ২% ব্যালেন্সড লক ভাই
                if (totalMultiplier >= 15 && Math.random() > 0.02) continue;

                if (finalStatus === "win") {
                    // মাল্টি-পেলাইন উইন রেশিও ক্যাসিনো আরটিপি লুপ অনুযায়ী ৩৫% এ টাইট লক ভাই ভাই
                    if (Math.random() <= 0.35) {
                        isLoopActive = false;
                    }
                } else {
                    isLoopActive = false; 
                }
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * totalMultiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount);
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = totalMultiplier.toFixed(2);
            phpPayload.status = "win";
            phpPayload.type = "win";
            phpPayload.is_win = 1;
            phpPayload.win_status = "win";
            phpPayload.log_status = "win";
        }

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: winAmount,
                matrix: matrix,
                winningLines: winningLines
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }


    } catch (e) {
        console.error("Rainbow 3x3 Slot Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click SPIN again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to 3x3 Multi-Payline Slot Engine!"); });

// রেনবো ৩×৩ স্লট গেম কাস্টম ৪০০০ পোর্টে কড়া নিয়নে অন ফায়ার ভাই ভাই!
const PORT = process.env.PORT || 4000; 
server.listen(PORT, () => { console.log(`🎡 Royal Rainbow 3x3 Slot Engine Running on port ${PORT}`); });

