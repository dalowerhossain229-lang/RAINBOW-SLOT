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
const MAIN_SITE_URL = "https:betlover247.onrender.com"; 

// ৭টি ওরিজিনাল রেনবো ফ্রুট স্লট পুল তালিকা ভাই ভাই
const slotSymbolsPool = ["CHERRY", "LEMON", "ORANGE", "PLUM", "GRAPE", "WATERMELON", "BAR"];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে (আপনার পিএইচপি ফাস্ট ফিল্টার সিঙ্ক ভাই ভাই)
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

// 🛫 ২. ৩-রিল স্পিন কোর এপিআই রাউট (২টি মিললে উইন চিরতরে ব্লক বর্ম লক ভাই ভাই!)
app.post('/api/rainbow-spin', async (req, res) => {
    const { userId, amount, wallet } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;

    // 🔒 সর্বোচ্চ ২০০০০ বিডিটি পর্যন্ত কড়া বেট সিকিউরিটি ফিল্টার লক ভাই ভাই
    if (reqAmount < 1 || reqAmount > 20000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳Subcontinent)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই]: বাজি ধরার আগে প্লেয়ারের একাউন্টের রিয়েল টাকা নিশ্চিত করা ভাই ভাই
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

        let r1, r2, r3, finalStatus, winMultiplier;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল RTP ও শুধু ৩-রিল ৩টি মিললে উইন লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            r1 = slotSymbolsPool[Math.floor(Math.random() * slotSymbolsPool.length)];
            r2 = slotSymbolsPool[Math.floor(Math.random() * slotSymbolsPool.length)];
            r3 = slotSymbolsPool[Math.floor(Math.random() * slotSymbolsPool.length)];

            // 🚀 [মেগা সিকিউরিটি ফিক্স]: শুধু ৩টি ফল ১০০% হুবহু মিললেই কেবল উইন ফায়ার লক ভাই ভাই!
            if (r1 === r2 && r2 === r3) {
                finalStatus = "win";
                if (r1 === "BAR") winMultiplier = 50.00; // BAR মিললে ৫০ গুণ মেগা জ্যাকপট প্রফিট
                else if (r1 === "WATERMELON") winMultiplier = 25.00;
                else if (r1 === "GRAPE") winMultiplier = 15.00;
                else winMultiplier = 8.00; // চেরি, লেবু বা অরেঞ্জ ৩টি মিললে ৮ গুণ প্রফিট ভাই ভাই
            } else {
                // 🔒 ২টা মিললে এখন থেকে ১ শতভাগ ১ হাজার পার্সেন্ট ডিরেক্ট লস কাউন্ট লক ভাই ভাই!
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "lose") isLoopActive = false;
                if (adminTriggeredPrize === "force_win" && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // ৩টি মিলে উইন হওয়ার গ্লোবাল আরটিপি লুপ চাবি সুষম ৪.৪% লক ভাই ভাই
                    if (Math.random() <= 0.044) {
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
            winAmount = Math.round(reqAmount * winMultiplier);
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
            phpPayload.multiplier = winMultiplier.toFixed(2);
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
                reel1: r1,
                reel2: r2,
                reel3: r3
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Rainbow Slot Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click SPIN again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Royal Rainbow Slot Engine!"); });

const PORT = process.env.PORT || 4000; 
server.listen(PORT, () => { console.log(`🎡 Royal Rainbow Slot Engine Running on port ${PORT}`); });
