require("dotenv").config();
const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `คุณคือ Budget Buddy AI ผู้ช่วยให้ความรู้ด้านการบริหารงบประมาณสถานศึกษาในประเทศไทย
หน้าที่:
- อธิบายแนวทางและขั้นตอนเป็นภาษาไทยที่ชัดเจน กระชับ เป็นมิตร และเป็นระบบ
- ช่วยจัดทำรายการตรวจสอบเอกสาร คำถามที่ควรถามผู้รับผิดชอบ และร่างเอกสารเบื้องต้น
- แยกให้ชัดระหว่างหลักการทั่วไปกับข้อกำหนดที่ต้องตรวจสอบจากระเบียบ/หนังสือสั่งการฉบับปัจจุบัน
- ห้ามแต่งเลขที่หนังสือ วันที่ มาตรา วงเงิน อัตรา หรืออ้างว่าได้ตรวจสอบแหล่งข้อมูลล่าสุดแล้ว หากไม่มีข้อมูลยืนยัน
- เมื่อคำถามเกี่ยวข้องกับระเบียบที่อาจเปลี่ยนแปลง ให้แนะนำตรวจสอบเอกสารฉบับล่าสุดจากหน่วยงานทางการ เช่น กระทรวงการคลัง กรมบัญชีกลาง หรือหน่วยงานต้นสังกัด
- ไม่ให้คำตอบแทนการอนุมัติของผู้มีอำนาจ และไม่ควรเปิดเผยข้อมูลส่วนบุคคลหรือข้อมูลลับ
- หากข้อมูลไม่พอ ให้ถามคำถามสั้น ๆ เพื่อขอรายละเอียดที่จำเป็น
รูปแบบคำตอบที่เหมาะสม: สรุปคำตอบ, ขั้นตอนดำเนินการ, เอกสารที่ควรเตรียม, ข้อควรตรวจสอบ`;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "ยังไม่ได้ตั้งค่า OPENAI_API_KEY กรุณาตั้งค่าในไฟล์ .env แล้วเริ่มระบบใหม่",
        code: "AI_NOT_CONFIGURED"
      });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "กรุณาพิมพ์คำถามก่อนส่ง" });
    }
    const safeMessages = messages.slice(-12).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 6000)
    })).filter(m => m.content.trim());
    if (!safeMessages.length || safeMessages[safeMessages.length - 1].role !== "user") {
      return res.status(400).json({ error: "รูปแบบข้อความไม่ถูกต้อง" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
      temperature: 0.3,
      max_tokens: 1200
    });
    res.json({ reply: completion.choices?.[0]?.message?.content || "ขออภัย ระบบยังไม่สามารถสร้างคำตอบได้" });
  } catch (err) {
    console.error("AI request failed:", err?.message || err);
    const status = err?.status === 401 ? 502 : 500;
    res.status(status).json({
      error: err?.status === 401
        ? "API key ไม่ถูกต้อง กรุณาตรวจสอบการตั้งค่า"
        : "เกิดข้อผิดพลาดระหว่างเรียก AI กรุณาลองใหม่อีกครั้ง",
      code: "AI_REQUEST_FAILED"
    });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`Budget Buddy AI running at http://localhost:${PORT}`));
