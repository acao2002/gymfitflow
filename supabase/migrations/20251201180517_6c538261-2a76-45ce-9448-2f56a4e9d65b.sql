-- Reset sequences to start after existing data
SELECT setval(pg_get_serial_sequence('member', 'member_id'), COALESCE(MAX(member_id), 0) + 1, false) FROM member;
SELECT setval(pg_get_serial_sequence('trainer', 'trainer_id'), COALESCE(MAX(trainer_id), 0) + 1, false) FROM trainer;
SELECT setval(pg_get_serial_sequence('class', 'class_id'), COALESCE(MAX(class_id), 0) + 1, false) FROM class;
SELECT setval(pg_get_serial_sequence('attendance', 'attendance_id'), COALESCE(MAX(attendance_id), 0) + 1, false) FROM attendance;
SELECT setval(pg_get_serial_sequence('membership', 'plan_id'), COALESCE(MAX(plan_id), 0) + 1, false) FROM membership;