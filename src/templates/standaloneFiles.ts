export const STANDALONE_SURVEY_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Firebase App & Realtime Database SDK (Compat version for zero-build HTML) -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      padding-bottom: 40px;
    }
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      padding: 24px 20px;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header h1 { font-size: 1.35rem; font-weight: 700; margin-bottom: 6px; }
    .header p { font-size: 0.875rem; color: #94a3b8; }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 16px;
    }
    .card {
      background: #ffffff;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .q-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .q-desc {
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 14px;
    }
    .rating-group {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }
    .rate-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 4px;
      min-height: 58px;
      background: #f1f5f9;
      border: 2px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
      touch-action: manipulation;
    }
    .rate-btn:active { transform: scale(0.96); }
    .rate-btn .num { font-size: 1.15rem; font-weight: 700; color: #334155; }
    .rate-btn .emoji { font-size: 1.25rem; margin-bottom: 2px; }
    .rate-btn .txt { font-size: 0.65rem; color: #64748b; font-weight: 500; text-align: center; }
    
    .rate-btn.selected {
      background: #eff6ff;
      border-color: #2563eb;
    }
    .rate-btn.selected .num { color: #1d4ed8; }
    .rate-btn.selected .txt { color: #1d4ed8; font-weight: 600; }

    .textarea-box {
      width: 100%;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px;
      font-family: inherit;
      font-size: 0.95rem;
      min-height: 90px;
      resize: vertical;
      color: #0f172a;
    }
    .textarea-box:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .btn-submit {
      width: 100%;
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 14px;
      padding: 16px;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      transition: all 0.15s;
    }
    .btn-submit:active { transform: scale(0.98); }
    .btn-submit:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      box-shadow: none;
    }
    .toast-error {
      background: #fee2e2;
      color: #991b1b;
      padding: 12px;
      border-radius: 10px;
      font-size: 0.875rem;
      margin-bottom: 14px;
      display: none;
    }
    .success-screen {
      display: none;
      text-align: center;
      padding: 40px 20px;
    }
    .success-icon {
      font-size: 3.5rem;
      margin-bottom: 16px;
    }
    .success-screen h2 {
      font-size: 1.4rem;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .success-screen p {
      color: #64748b;
      font-size: 0.95rem;
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>แบบประเมินความพึงพอใจการอบรม</h1>
    <p>ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาหลักสูตร</p>
  </div>

  <div class="container">
    <div id="toastError" class="toast-error"></div>

    <!-- Form Section -->
    <div id="surveyForm">
      <!-- Question 1 -->
      <div class="card">
        <div class="q-title">1. เนื้อหาหลักสูตรมีความน่าสนใจและเป็นประโยชน์</div>
        <div class="q-desc">ความทันสมัย ครบถ้วน และนำไปประยุกต์ใช้งานได้จริง</div>
        <div class="rating-group" data-q="q1">
          <button type="button" class="rate-btn" onclick="setRating('q1', 1, this)"><span class="emoji">😞</span><span class="num">1</span><span class="txt">น้อยที่สุด</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q1', 2, this)"><span class="emoji">🙁</span><span class="num">2</span><span class="txt">น้อย</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q1', 3, this)"><span class="emoji">😐</span><span class="num">3</span><span class="txt">ปานกลาง</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q1', 4, this)"><span class="emoji">😊</span><span class="num">4</span><span class="txt">มาก</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q1', 5, this)"><span class="emoji">🤩</span><span class="num">5</span><span class="txt">มากที่สุด</span></button>
        </div>
      </div>

      <!-- Question 2 -->
      <div class="card">
        <div class="q-title">2. วิทยากรมีความรู้ความเชี่ยวชาญและถ่ายทอดได้ชัดเจน</div>
        <div class="q-desc">เทคนิคการสอน ตอบข้อซักถามกระจ่าง และกระตือรือร้น</div>
        <div class="rating-group" data-q="q2">
          <button type="button" class="rate-btn" onclick="setRating('q2', 1, this)"><span class="emoji">😞</span><span class="num">1</span><span class="txt">น้อยที่สุด</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q2', 2, this)"><span class="emoji">🙁</span><span class="num">2</span><span class="txt">น้อย</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q2', 3, this)"><span class="emoji">😐</span><span class="num">3</span><span class="txt">ปานกลาง</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q2', 4, this)"><span class="emoji">😊</span><span class="num">4</span><span class="txt">มาก</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q2', 5, this)"><span class="emoji">🤩</span><span class="num">5</span><span class="txt">มากที่สุด</span></button>
        </div>
      </div>

      <!-- Question 3 -->
      <div class="card">
        <div class="q-title">3. การจัดลำดับหัวข้อและระยะเวลาในการอบรมเหมาะสม</div>
        <div class="q-desc">ความต่อเนื่องของเนื้อหา และเวลาในการฝึกปฏิบัติ/ซักถาม</div>
        <div class="rating-group" data-q="q3">
          <button type="button" class="rate-btn" onclick="setRating('q3', 1, this)"><span class="emoji">😞</span><span class="num">1</span><span class="txt">น้อยที่สุด</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q3', 2, this)"><span class="emoji">🙁</span><span class="num">2</span><span class="txt">น้อย</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q3', 3, this)"><span class="emoji">😐</span><span class="num">3</span><span class="txt">ปานกลาง</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q3', 4, this)"><span class="emoji">😊</span><span class="num">4</span><span class="txt">มาก</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q3', 5, this)"><span class="emoji">🤩</span><span class="num">5</span><span class="txt">มากที่สุด</span></button>
        </div>
      </div>

      <!-- Question 4 -->
      <div class="card">
        <div class="q-title">4. สื่อ เอกสารประกอบ และอุปกรณ์ที่ใช้มีคุณภาพ</div>
        <div class="q-desc">สไลด์บรรยาย เอกสารแจก ระบบภาพและเสียง</div>
        <div class="rating-group" data-q="q4">
          <button type="button" class="rate-btn" onclick="setRating('q4', 1, this)"><span class="emoji">😞</span><span class="num">1</span><span class="txt">น้อยที่สุด</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q4', 2, this)"><span class="emoji">🙁</span><span class="num">2</span><span class="txt">น้อย</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q4', 3, this)"><span class="emoji">😐</span><span class="num">3</span><span class="txt">ปานกลาง</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q4', 4, this)"><span class="emoji">😊</span><span class="num">4</span><span class="txt">มาก</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q4', 5, this)"><span class="emoji">🤩</span><span class="num">5</span><span class="txt">มากที่สุด</span></button>
        </div>
      </div>

      <!-- Question 5 -->
      <div class="card">
        <div class="q-title">5. ความพึงพอใจต่อภาพรวมและการอำนวยความสะดวก</div>
        <div class="q-desc">บรรยากาศ สถานที่ อาหารว่าง และความคุ้มค่าของการเข้าร่วม</div>
        <div class="rating-group" data-q="q5">
          <button type="button" class="rate-btn" onclick="setRating('q5', 1, this)"><span class="emoji">😞</span><span class="num">1</span><span class="txt">น้อยที่สุด</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q5', 2, this)"><span class="emoji">🙁</span><span class="num">2</span><span class="txt">น้อย</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q5', 3, this)"><span class="emoji">😐</span><span class="num">3</span><span class="txt">ปานกลาง</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q5', 4, this)"><span class="emoji">😊</span><span class="num">4</span><span class="txt">มาก</span></button>
          <button type="button" class="rate-btn" onclick="setRating('q5', 5, this)"><span class="emoji">🤩</span><span class="num">5</span><span class="txt">มากที่สุด</span></button>
        </div>
      </div>

      <!-- Optional Feedback -->
      <div class="card">
        <div class="q-title">ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)</div>
        <div class="q-desc">สิ่งที่ประทับใจ หรือข้อเสนอแนะในการพัฒนาหัวข้อถัดไป</div>
        <textarea id="feedbackInput" class="textarea-box" placeholder="พิมพ์ความคิดเห็นของท่านที่นี่..."></textarea>
      </div>

      <button id="submitBtn" class="btn-submit" onclick="submitSurvey()">ส่งแบบประเมินความพึงพอใจ</button>
    </div>

    <!-- Success Screen (Anti-Duplicate) -->
    <div id="successScreen" class="card success-screen">
      <div class="success-icon">🎉</div>
      <h2>ขอบคุณสำหรับความคิดเห็น!</h2>
      <p style="margin-bottom: 16px;">ข้อมูลของท่านถูกบันทึกเรียบร้อยแล้ว และกำลังแสดงผลบน Dashboard ของผู้จัดอบรม</p>
      <div id="submittedSummary" style="background:#f8fafc; border-radius:12px; padding:12px; font-size:0.875rem; color:#475569; margin-bottom:16px;"></div>
      <button type="button" onclick="resetForNewTest()" style="background:transparent; border:1px solid #cbd5e1; border-radius:8px; padding:8px 16px; font-size:0.8rem; color:#64748b; cursor:pointer;">
        ทดสอบส่งใหม่อีกครั้ง (สำหรับทดสอบ)
      </button>
    </div>
  </div>

  <script>
    // ==========================================
    // 1. ตั้งค่า Firebase Configuration ของคุณที่นี่
    // (นำมาจาก Firebase Console > Project Settings)
    // ==========================================
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // ตรวจสอบและเริ่มต้น Firebase (หากยังไม่ได้กรอก config จะบันทึกลง localStorage สำรอง)
    let isFirebaseReady = false;
    let db = null;
    try {
      if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        isFirebaseReady = true;
      }
    } catch(e) {
      console.warn("Firebase Init warning:", e);
    }

    // เก็บค่าคะแนนของผู้ตอบ
    const answers = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };

    // ตรวจสอบการส่งซ้ำในเครื่องเดียวกัน (Anti-duplicate prevention)
    window.addEventListener('DOMContentLoaded', () => {
      const submitted = localStorage.getItem('training_survey_submitted');
      if (submitted) {
        showSuccessView(JSON.parse(submitted));
      }
    });

    function setRating(questionId, score, buttonElement) {
      answers[questionId] = score;
      const group = buttonElement.closest('.rating-group');
      group.querySelectorAll('.rate-btn').forEach(btn => btn.classList.remove('selected'));
      buttonElement.classList.add('selected');
      hideError();
    }

    function showError(msg) {
      const toast = document.getElementById('toastError');
      toast.innerText = msg;
      toast.style.display = 'block';
      toast.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideError() {
      document.getElementById('toastError').style.display = 'none';
    }

    async function submitSurvey() {
      // ตรวจสอบว่าตอบครบ 5 ข้อหรือไม่
      for (let i = 1; i <= 5; i++) {
        if (!answers['q' + i]) {
          showError('กรุณาให้คะแนนข้อ ' + i + ' ให้ครบถ้วนก่อนส่งแบบประเมิน');
          return;
        }
      }

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerText = 'กำลังส่งข้อมูล...';

      const feedback = document.getElementById('feedbackInput').value.trim();
      const avg = +((answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5) / 5).toFixed(2);
      const timestamp = new Date().toISOString();

      const payload = {
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
        feedback: feedback,
        average: avg,
        timestamp: timestamp
      };

      try {
        if (isFirebaseReady && db) {
          // บันทึกลง Firebase Realtime Database ที่โหนด 'training_responses'
          await db.ref('training_responses').push(payload);
        } else {
          // หากยังไม่ได้ผูก Firebase ให้บันทึกใน LocalStorage จำลอง
          const localList = JSON.parse(localStorage.getItem('training_responses') || '[]');
          localList.unshift({ id: 'resp-' + Date.now(), ...payload });
          localStorage.setItem('training_responses', JSON.stringify(localList));
        }

        // ล็อกไม่ให้ส่งซ้ำในเครื่องนี้
        localStorage.setItem('training_survey_submitted', JSON.stringify(payload));
        showSuccessView(payload);
      } catch (err) {
        console.error(err);
        showError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
        submitBtn.disabled = false;
        submitBtn.innerText = 'ส่งแบบประเมินความพึงพอใจ';
      }
    }

    function showSuccessView(data) {
      document.getElementById('surveyForm').style.display = 'none';
      const screen = document.getElementById('successScreen');
      screen.style.display = 'block';
      document.getElementById('submittedSummary').innerHTML = 
        'คะแนนเฉลี่ยที่คุณประเมิน: <strong>' + data.average + ' / 5.00</strong><br>' +
        'เวลาที่ส่ง: ' + new Date(data.timestamp).toLocaleTimeString('th-TH');
    }

    function resetForNewTest() {
      localStorage.removeItem('training_survey_submitted');
      location.reload();
    }
  </script>
</body>
</html>`;

export const STANDALONE_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Dashboard ผลการประเมินการอบรม (Projector)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Chart.js & QRCode.js for Projector presentation -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
  <!-- Firebase App & Realtime Database SDK (Compat) -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0b1120;
      color: #f8fafc;
      min-height: 100vh;
      padding: 24px 32px;
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #1e293b;
      margin-bottom: 24px;
    }
    .top-title h1 {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .top-title p {
      font-size: 0.9rem;
      color: #94a3b8;
    }
    .top-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 10px;
      border: 1px solid #334155;
      background: #1e293b;
      color: #f8fafc;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn:hover { background: #334155; }
    .btn-primary {
      background: #2563eb;
      border-color: #3b82f6;
    }
    .btn-primary:hover { background: #1d4ed8; }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: #131c31;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 20px;
      text-align: center;
    }
    .kpi-label { font-size: 0.85rem; color: #94a3b8; margin-bottom: 6px; }
    .kpi-value { font-size: 2.75rem; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1.1; }
    .kpi-sub { font-size: 0.85rem; margin-top: 6px; font-weight: 500; }

    /* Layout Split */
    .main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    .panel {
      background: #131c31;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 24px;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .panel-title { font-size: 1.15rem; font-weight: 700; color: #ffffff; }

    /* Question Bars */
    .q-bar-item { margin-bottom: 18px; }
    .q-bar-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 0.95rem;
    }
    .q-bar-title { color: #e2e8f0; font-weight: 500; }
    .q-bar-score { font-weight: 700; font-variant-numeric: tabular-nums; color: #60a5fa; }
    .progress-track {
      background: #1e293b;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #10b981);
      border-radius: 6px;
      transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Live Feed */
    .feed-list {
      max-height: 380px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .feed-item {
      background: #182239;
      border: 1px solid #23314f;
      border-radius: 12px;
      padding: 14px;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .feed-time { font-size: 0.75rem; color: #94a3b8; margin-top: 6px; }

    /* QR Code Box */
    .qr-card {
      text-align: center;
      background: #1e293b;
      padding: 20px;
      border-radius: 14px;
      margin-top: 20px;
    }
    .qr-container {
      background: #ffffff;
      padding: 12px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 10px;
    }

    @media (max-width: 900px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .main-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <div class="top-bar">
    <div class="top-title">
      <h1>ผลการประเมินความพึงพอใจการอบรม (Live Dashboard)</h1>
      <p>ระบบอัปเดตข้อมูลอัตโนมัติแบบเรียลไทม์เมื่อมีผู้ตอบแบบประเมิน</p>
    </div>
    <div class="top-actions">
      <button class="btn" onclick="toggleFullscreen()">🖥️ จอโปรเจกเตอร์</button>
      <button class="btn btn-primary" onclick="exportCSV()">📥 ดาวน์โหลด CSV</button>
    </div>
  </div>

  <!-- KPI Summary -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">จำนวนผู้ตอบแบบประเมิน</div>
      <div id="statTotal" class="kpi-value" style="color: #38bdf8;">0</div>
      <div class="kpi-sub" style="color: #94a3b8;">ผู้เข้าร่วม</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">คะแนนเฉลี่ยรวม (Likert Scale)</div>
      <div id="statAvg" class="kpi-value" style="color: #4ade80;">0.00</div>
      <div class="kpi-sub" style="color: #94a3b8;">เต็ม 5.00 คะแนน</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">ระดับความพึงพอใจ</div>
      <div id="statLevel" class="kpi-value" style="font-size: 2.1rem; color: #fbbf24;">-</div>
      <div class="kpi-sub" style="color: #94a3b8;">เกณฑ์แปลผล 5 ระดับ</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">สัดส่วนพึงพอใจระดับมาก-มากที่สุด</div>
      <div id="statHigh" class="kpi-value" style="color: #a78bfa;">0%</div>
      <div class="kpi-sub" style="color: #94a3b8;">ระดับ 4 และ 5</div>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="main-grid">
    <!-- Question Mean Scores -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">คะแนนเฉลี่ยแยกตามรายข้อ (5 ด้าน)</div>
        <div style="font-size: 0.85rem; color: #94a3b8;">เป้าหมาย: ≥ 3.51 (ระดับมาก)</div>
      </div>

      <div class="q-bar-item">
        <div class="q-bar-header">
          <span class="q-bar-title">1. เนื้อหาหลักสูตรมีความน่าสนใจและเป็นประโยชน์</span>
          <span id="score-q1" class="q-bar-score">0.00</span>
        </div>
        <div class="progress-track"><div id="fill-q1" class="progress-fill" style="width: 0%;"></div></div>
      </div>

      <div class="q-bar-item">
        <div class="q-bar-header">
          <span class="q-bar-title">2. วิทยากรมีความเชี่ยวชาญและถ่ายทอดได้ชัดเจน</span>
          <span id="score-q2" class="q-bar-score">0.00</span>
        </div>
        <div class="progress-track"><div id="fill-q2" class="progress-fill" style="width: 0%;"></div></div>
      </div>

      <div class="q-bar-item">
        <div class="q-bar-header">
          <span class="q-bar-title">3. การจัดลำดับหัวข้อและระยะเวลาเหมาะสม</span>
          <span id="score-q3" class="q-bar-score">0.00</span>
        </div>
        <div class="progress-track"><div id="fill-q3" class="progress-fill" style="width: 0%;"></div></div>
      </div>

      <div class="q-bar-item">
        <div class="q-bar-header">
          <span class="q-bar-title">4. สื่อ เอกสาร และอุปกรณ์มีคุณภาพ</span>
          <span id="score-q4" class="q-bar-score">0.00</span>
        </div>
        <div class="progress-track"><div id="fill-q4" class="progress-fill" style="width: 0%;"></div></div>
      </div>

      <div class="q-bar-item">
        <div class="q-bar-header">
          <span class="q-bar-title">5. ความพึงพอใจต่อภาพรวมและการจัดงาน</span>
          <span id="score-q5" class="q-bar-score">0.00</span>
        </div>
        <div class="progress-track"><div id="fill-q5" class="progress-fill" style="width: 0%;"></div></div>
      </div>

      <!-- Interpretation Scale Reference -->
      <div style="margin-top: 24px; padding: 14px; background: #0f172a; border-radius: 12px; font-size: 0.8rem; color: #94a3b8; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span><strong>เกณฑ์การแปลผล:</strong></span>
        <span>4.51-5.00 มากที่สุด</span>
        <span>3.51-4.50 มาก</span>
        <span>2.51-3.50 ปานกลาง</span>
        <span>1.51-2.50 น้อย</span>
        <span>1.00-1.50 น้อยที่สุด</span>
      </div>
    </div>

    <!-- Right Side: Live Feedback & QR Code -->
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">ข้อเสนอแนะล่าสุดจากผู้เข้าอบรม</div>
        </div>
        <div id="feedbackList" class="feed-list">
          <div style="color: #64748b; text-align: center; padding: 20px;">ยังไม่มีข้อเสนอแนะ</div>
        </div>
      </div>

      <!-- QR Code on Screen -->
      <div class="qr-card">
        <div style="font-weight: 600; font-size: 1rem; margin-bottom: 8px; color: #ffffff;">สแกนเพื่อร่วมตอบแบบประเมิน</div>
        <div class="qr-container" id="qrContainer"></div>
        <div style="font-size: 0.75rem; color: #94a3b8;">สแกนผ่านกล้องโทรศัพท์มือถือได้ทันที</div>
      </div>
    </div>
  </div>

  <script>
    // ==========================================
    // 1. ตั้งค่า Firebase Configuration
    // (กรอกข้อมูลเดียวกับหน้า survey.html)
    // ==========================================
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let allResponses = [];

    // สร้าง QR Code ให้ผู้เข้าอบรมสแกน
    window.addEventListener('DOMContentLoaded', () => {
      new QRCode(document.getElementById("qrContainer"), {
        text: window.location.href.replace('dashboard.html', 'survey.html'),
        width: 140,
        height: 140,
        colorDark : "#0f172a",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });

      initDataListener();
    });

    function initDataListener() {
      try {
        if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
          firebase.initializeApp(firebaseConfig);
          const db = firebase.database();
          
          // ฟังข้อมูลเรียลไทม์ผ่าน Realtime Database .on('value')
          db.ref('training_responses').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
              allResponses = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            } else {
              allResponses = [];
            }
            renderDashboard();
          });
          return;
        }
      } catch (err) {
        console.warn('Firebase init warning:', err);
      }

      // โหมดสำรอง: อ่านจาก LocalStorage
      loadFromStorage();
      window.addEventListener('storage', loadFromStorage);
    }

    function loadFromStorage() {
      allResponses = JSON.parse(localStorage.getItem('training_responses') || '[]');
      renderDashboard();
    }

    function interpretScore(score) {
      if (score >= 4.51) return 'มากที่สุด';
      if (score >= 3.51) return 'มาก';
      if (score >= 2.51) return 'ปานกลาง';
      if (score >= 1.51) return 'น้อย';
      return 'น้อยที่สุด';
    }

    function renderDashboard() {
      const total = allResponses.length;
      document.getElementById('statTotal').innerText = total;

      if (total === 0) {
        document.getElementById('statAvg').innerText = '0.00';
        document.getElementById('statLevel').innerText = '-';
        document.getElementById('statHigh').innerText = '0%';
        return;
      }

      let sumQ = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
      let highCount = 0;
      let totalPoints = 0;

      allResponses.forEach(r => {
        ['q1','q2','q3','q4','q5'].forEach(q => {
          const val = Number(r[q]) || 5;
          sumQ[q] += val;
          totalPoints += 1;
          if (val >= 4) highCount += 1;
        });
      });

      const avgQ = {
        q1: (sumQ.q1 / total).toFixed(2),
        q2: (sumQ.q2 / total).toFixed(2),
        q3: (sumQ.q3 / total).toFixed(2),
        q4: (sumQ.q4 / total).toFixed(2),
        q5: (sumQ.q5 / total).toFixed(2),
      };

      const overall = ((+avgQ.q1 + +avgQ.q2 + +avgQ.q3 + +avgQ.q4 + +avgQ.q5) / 5).toFixed(2);
      document.getElementById('statAvg').innerText = overall;
      document.getElementById('statLevel').innerText = interpretScore(overall);
      document.getElementById('statHigh').innerText = Math.round((highCount / totalPoints) * 100) + '%';

      // อัปเดตกราฟแท่ง
      ['q1','q2','q3','q4','q5'].forEach(q => {
        const val = avgQ[q];
        document.getElementById('score-' + q).innerText = val + ' / 5.00';
        document.getElementById('fill-' + q).style.width = (val / 5 * 100) + '%';
      });

      // อัปเดตรายการข้อเสนอแนะ
      const feedbackContainer = document.getElementById('feedbackList');
      const feedbacks = allResponses.filter(r => r.feedback && r.feedback.trim() !== '');
      if (feedbacks.length === 0) {
        feedbackContainer.innerHTML = '<div style="color: #64748b; text-align: center; padding: 20px;">ยังไม่มีข้อเสนอแนะ</div>';
      } else {
        feedbackContainer.innerHTML = feedbacks.slice(-10).reverse().map(f => \`
          <div class="feed-item">
            <div>\${escapeHTML(f.feedback)}</div>
            <div class="feed-time">\${new Date(f.timestamp).toLocaleTimeString('th-TH')} · คะแนนเฉลี่ย \${f.average || 5.00}</div>
          </div>
        \`).join('');
      }
    }

    function escapeHTML(str) {
      return (str || '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[m]);
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }

    function exportCSV() {
      if (allResponses.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
        return;
      }
      const BOM = '\\uFEFF';
      let csv = BOM + 'ลำดับ,วันเวลา,ข้อ 1 (เนื้อหา),ข้อ 2 (วิทยากร),ข้อ 3 (ระยะเวลา),ข้อ 4 (สื่ออุปกรณ์),ข้อ 5 (ภาพรวม),คะแนนเฉลี่ย,ข้อเสนอแนะ\\r\\n';
      allResponses.forEach((r, idx) => {
        csv += [
          idx + 1,
          new Date(r.timestamp).toLocaleString('th-TH'),
          r.q1,
          r.q2,
          r.q3,
          r.q4,
          r.q5,
          r.average,
          '"' + (r.feedback || '').replace(/"/g, '""') + '"'
        ].join(',') + '\\r\\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'training-evaluation-report.csv';
      a.click();
      URL.revokeObjectURL(a);
    }
  </script>
</body>
</html>`;

export const DEPLOYMENT_GUIDE_MARKDOWN = `### คู่มือการตั้งค่า Firebase Realtime Database และ Deploy ทีละขั้นตอน

#### ขั้นตอนที่ 1: สร้าง Firebase Project ฟรี (Spark Plan ไม่ต้องใช้บัตรเครดิต)
1. ไปที่เว็บไซต์ **[Firebase Console](https://console.firebase.google.com/)** และลงชื่อเข้าใช้ด้วย Google Account
2. คลิกปุ่ม **"Add project" (เพิ่มโครงการ)**
3. ตั้งชื่อโปรเจกต์ เช่น \`training-feedback-app\` แล้วกด **Continue**
4. หน้า Google Analytics สามารถเลือกเปิดหรือปิดก็ได้ แล้วคลิก **"Create project"**
5. รอระบบสร้างโปรเจกต์ประมาณ 10 วินาที เมื่อเสร็จแล้วกด **Continue**

---

#### ขั้นตอนที่ 2: สร้างและเปิดใช้งาน Firebase Realtime Database
1. ในเมนูด้านซ้ายของ Firebase Console ไปที่ **Build** > คลิก **Realtime Database**
2. คลิกปุ่ม **"Create Database" (สร้างฐานข้อมูล)**
3. เลือก **Realtime Database Location** แนะนำเลือก:
   - \`Singapore (asia-southeast1)\` เพื่อความเร็วสูงสุดสำหรับผู้ใช้ในประเทศไทย
4. ในหน้า Security Rules เลือก **"Start in test mode" (เริ่มในโหมดทดสอบ)** แล้วกด **Enable**

---

#### ขั้นตอนที่ 3: กำหนด Security Rules ให้ปลอดภัย
ในแท็บ **Rules** ของ Realtime Database ให้วางเงื่อนไขความปลอดภัยต่อไปนี้ เพื่อให้ทุกคนส่งแบบสอบถามได้โดยไม่ต้องล็อกอิน และป้องกันข้อมูลเสียหาย:

\`\`\`json
{
  "rules": {
    "training_responses": {
      // อนุญาตให้อ่านข้อมูลทั้งหมดได้ (สำหรับหน้า Dashboard)
      ".read": true,
      
      // อนุญาตให้ทุกคนส่งผลการประเมินได้
      "$response_id": {
        ".write": true,
        // ตรวจสอบว่าต้องมีคะแนน q1-q5 ครบทุกข้อ และคะแนนต้องอยู่ในช่วง 1 ถึง 5
        ".validate": "newData.hasChildren(['q1', 'q2', 'q3', 'q4', 'q5', 'timestamp']) &&
                      newData.child('q1').isNumber() && newData.child('q1').val() >= 1 && newData.child('q1').val() <= 5 &&
                      newData.child('q2').isNumber() && newData.child('q2').val() >= 1 && newData.child('q2').val() <= 5 &&
                      newData.child('q3').isNumber() && newData.child('q3').val() >= 1 && newData.child('q3').val() <= 5 &&
                      newData.child('q4').isNumber() && newData.child('q4').val() >= 1 && newData.child('q4').val() <= 5 &&
                      newData.child('q5').isNumber() && newData.child('q5').val() >= 1 && newData.child('q5').val() <= 5"
      }
    }
  }
}
\`\`\`
คลิก **Publish** เพื่อบันทึก Rules

---

#### ขั้นตอนที่ 4: คัดลอก Firebase Config มาใส่ในโค้ด
1. ไปที่รูปฟันเฟือง ⚙️ มุมบนซ้าย > เลือก **Project settings**
2. เลื่อนลงมาที่หัวข้อ **Your apps** > คลิกไอคอนเว็บ **</> (Web)**
3. ตั้งชื่อแอป เช่น \`training-web\` แล้วคลิก **Register app**
4. คุณจะเห็นบล็อก \`const firebaseConfig = { ... }\`
5. คัดลอกค่าเหล่านั้นมาแทนที่ในไฟล์ทั้งสอง:
   - เปิดไฟล์ \`survey.html\` และ \`dashboard.html\`
   - แทนที่ \`firebaseConfig\` ด้วยค่าของคุณ

---

#### ขั้นตอนที่ 5: วิธี Deploy ออนไลน์ฟรี (เลือกได้ 3 วิธี)

##### วิธีที่ 1: Deploy ผ่าน GitHub Pages (ง่ายที่สุด ไม่ต้องลงโปรแกรม)
1. ไปที่ [GitHub.com](https://github.com) สร้าง Repository ใหม่
2. อัปโหลดไฟล์ \`survey.html\` (แนะนำตั้งชื่อเป็น \`index.html\` ถ้าอยากให้เข้าเป็นหน้าแรก) และ \`dashboard.html\`
3. ไปที่ **Settings** > **Pages** > เลือก Branch เป็น \`main\` แล้วกด **Save**
4. จะได้ URL ฟรีทันที เช่น \`https://yourname.github.io/training-survey/\`

##### วิธีที่ 2: Deploy ผ่าน Vercel หรือ Netlify (ลากวางโฟลเดอร์)
1. สร้างโฟลเดอร์ในคอมพิวเตอร์ วางไฟล์ \`survey.html\` และ \`dashboard.html\`
2. เข้าเว็บ [app.netlify.com/drop](https://app.netlify.com/drop)
3. ลากโฟลเดอร์วางลงไป เว็บไซต์จะออนไลน์ทันทีภายใน 5 วินาที พร้อมลิงก์ HTTPS

##### วิธีที่ 3: Firebase Hosting ฟรี
1. ติดตั้ง Firebase CLI: \`npm install -g firebase-tools\`
2. ล็อกอิน: \`firebase login\`
3. เริ่มต้นโปรเจกต์: \`firebase init hosting\`
4. สั่งปล่อยขึ้นเว็บ: \`firebase deploy --only hosting\`
`;
