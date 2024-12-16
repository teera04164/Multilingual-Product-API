Back-end Questions

ข้อ 1. design new api
ตอบ.
เราสามารถสร้าง api ใหม่เช่น /aggregated-data ในการรวมทั้ง 3 api เข้าด้วยกัน
โดยใช้หลักการ call api ทั้ง 3 แบบ async และยิงแบบ parallel ของ api เเต่ละเส้น
จากนั้นพิจารณาในการ optimize เพิ่มเติมเช่น ถ้า api นี้มีคนเรียกจำนวนมาก 
เราก็สามารถ ยิงเเล้วมาเก็บไว้ที่ cache เพื่อให้ api มาดึงจาก cache แทน จะช่วยให้ response time เร็วขึ้น

ข้อ 2 performance test
ตอบ. 
1. ต้องกำหนดเป้าหมายในการ test ครั้งนี้ เช่น
- Feature นี้จะรองรับผู้ใช้งานได้มากน้อยเท่าไหร่
  - รองรับ user ได้กี่ Concurrent 
  - มี Throughput เท่าไหร่ 
- Resource ที่ใช้
  - Server ใช้ CPU, Memory ไปเท่าไหร่เมื่อเกิดโหลด

2. เลือกเครื่องมือในการ Load Testing
  เช่น k6, JMeter สำหรับจำลอง load

3. ทำแผนการ test เช่น 
- เริ่มยิงเทสเบื้องต้นเพื่อวัดค่าพื้นฐานของ feature
- ลองเพิ่ม load ไปทีละน้อย เพื่อดูการตอบสนองของระบบ
- ลองยิงโหลดแบบสูงๆ เพื่อดูว่าระบบจะเป็นอย่างไร
- ลองยิงโหลดคงที่ ปกติ เพื่อดูว่าจะเกิดปัญหาอะไรไหม เช่น memory Leak 

4. สรุปผลการทดสอบ
- เมื่อได้ข้อมูลการทดสอบของเเต่ละ step ก็จะได้ข้อมูลพวก Response Time, Throughput, และ Error Rate
- report พวกการใช้งาน resource CPU, memory
- จะได้ตัวเลขออกมาว่า feature นี้รองรับได้เท่าไหร่


ข้อ 3
  - การ validation
    - เพิ่ม การ validate โดยใช้ max length และ regex ในการ validate language_code
  - Database Design
    - ผม design โดยมี 2 table คือ product และ product_translation โดย product จะเก็บ แค่ id ของ product เเละ product_translation จะเก็บรายละเอียดของ product เเละมี Column language_code ที่บอกว่า คือภาษาอะไร
  - Testing Strategy
    - เพิ่ม unit test ระดับ service โดย mock พวก database repository
    - เพิ่ม integration test ระดับ service โดยการ connect ต่อ database
    - เพิ่ม e2e test โดยใช้ supertest ในการ ยิง request
