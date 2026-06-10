/**
 * سكربت نظام تسجيل البطولات - ArenoX
 * الوظائف: عداد تنازلي، تحديث ديناميكي للزر، إرسال البيانات لـ Google Sheets
 */

const maxPlayers = 64;
const scriptURL = 'https://script.google.com/macros/s/AKfycbztPjS9aZXOM0dZQJ4AMsqp6Wqts6HI4qJOUK-gqAGI1c55Qw7RisPtmtvhUbvFHRpGQA/exec';

// 1. تحديث واجهة المستخدم والعداد
function updateUI() {
    fetch(scriptURL)
        .then(res => res.text())
        .then(count => {
            let currentCount = parseInt(count) || 0;
            let remaining = maxPlayers - currentCount;

            const btn = document.getElementById('submitBtn');
            const counterDisplay = document.getElementById('counterDisplay');

            if (!btn || !counterDisplay) return;

            if (remaining <= 0) {
                counterDisplay.innerText = "اكتمل العدد! التسجيل المسبق متاح.";
                btn.innerText = "التسجيل المسبق";
                btn.style.background = "linear-gradient(135deg, #555, #333)";
            } else {
                counterDisplay.innerText = "المقاعد المتبقية: " + remaining + " / 64";
                btn.innerText = "إرسال الطلب";
                btn.style.background = "";
            }
        })
        .catch(err => console.error("Error fetching count:", err));
}

// 2. إرسال البيانات
document.getElementById('requestForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "جاري التسجيل...";

    const formData = {
        fullName: document.getElementById('fullName').value,
        userName: document.getElementById('userName').value,
        platform: document.getElementById('platform').value,
        tournamentType: document.getElementById('tournamentType').value,
        telegramUserName: document.getElementById('telegramUserName').value
    };

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(() => {
            showNotification("تم التسجيل بنجاح!");
            this.reset();

            setTimeout(updateUI, 1000);
        })
        .catch(() => {
            showNotification("حدث خطأ أثناء الإرسال!");

            btn.disabled = false;
            btn.innerText = "إرسال الطلب";
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerText = "إرسال الطلب";
        });
});

// 3. عرض التنبيهات
function showNotification(msg) {
    const box = document.getElementById('formResult');

    if (!box) return;

    box.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    box.style.display = 'block';

    setTimeout(() => {
        box.style.display = 'none';
    }, 4000);
}

// 4. اختيار البطولة من البطاقة
function selectTournament(name) {
    const typeSelect = document.getElementById('tournamentType');

    if (typeSelect) {
        typeSelect.value = name;

        document.getElementById('requestForm').scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// تشغيل النظام عند تحميل الصفحة
window.onload = updateUI;