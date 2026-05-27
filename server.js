        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            // ফ্রন্টএন্ড ক্যানভাসে ইমোজি রূপান্তরের জন্য ইংরেজি নাম পুশ ভাই ভাই
            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: winAmount,
                reel1: r1,
                reel2: r2,
                reel3: r3,
                combination: comboText
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

// ১৪ নম্বর গেম ২১০০০ এ চলছে, তাই ১৫ নম্বর রাজকীয় স্লট গেম প্রজেক্টের স্বাধীন কাস্টম পোর্ট ২২০০০ কড়া লক হলো ভাই ভাই!
const PORT = process.env.PORT || 22000;
server.listen(PORT, () => { console.log(`🎡 Royal Rainbow Slot Engine Running on port ${PORT}`); });
