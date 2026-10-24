# วิธีนำ Budget Buddy AI ขึ้นออนไลน์ (ทำครั้งเดียว)

## ก่อนเริ่ม
- ต้องมีบัญชี GitHub และ Render
- ต้องมี OpenAI API key และเปิดใช้งาน API billing/มีเครดิตที่เพียงพอ (ChatGPT Plus ไม่ได้รวมค่า API โดยอัตโนมัติ)
- ห้ามส่ง API key ให้ผู้อื่นหรือใส่ไว้ในไฟล์หน้าเว็บ

## 1) อัปโหลดไฟล์ขึ้น GitHub
1. แตกไฟล์ ZIP นี้ในคอมพิวเตอร์
2. เข้า https://github.com แล้วเข้าสู่ระบบ
3. กดเครื่องหมาย + > New repository
4. ตั้งชื่อ `budget-buddy-ai` เลือก Public หรือ Private แล้วกด Create repository
5. กด `Add file` > `Upload files`
6. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมดที่อยู่ใน ZIP ที่แตกแล้ว รวมถึง `render.yaml` และโฟลเดอร์ `public` (อัปโหลดเนื้อหาข้างใน ไม่ใช่ ZIP)
7. กด `Commit changes`

## 2) สร้างเว็บไซต์บน Render
1. เข้า https://render.com แล้วสมัคร/เข้าสู่ระบบ
2. เลือก New > Web Service แล้วเชื่อมบัญชี GitHub
3. เลือก repository `budget-buddy-ai`
4. ตั้งค่า:
   - Runtime/Language: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (ถ้ามีให้เลือก)
5. ใน Environment Variables เพิ่ม:
   - Key: `OPENAI_API_KEY` / Value: วาง API key ของคุณ
   - Key: `OPENAI_MODEL` / Value: `gpt-4o-mini`
6. กด Deploy Web Service และรอจนสถานะ Live
7. เปิด URL ที่ลงท้ายด้วย `onrender.com`

## หมายเหตุ
- เว็บไซต์จะตอบด้วย AI จริงเมื่อใส่ API key ที่ถูกต้องและบัญชี API ใช้งานได้
- Render Free อาจพักบริการเมื่อไม่มีผู้ใช้ ทำให้เปิดครั้งแรกหลังพักช้าลง
- คำตอบเรื่องระเบียบราชการ/การเงินต้องตรวจสอบกับเอกสารฉบับล่าสุดของหน่วยงานที่เกี่ยวข้อง
