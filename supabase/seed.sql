-- =============================================================================
-- QuizPop Seed Data
-- Sample Birthday Party Trivia quiz with 20 questions
-- =============================================================================

DO $$
DECLARE
  quiz_id uuid := gen_random_uuid();

  q1_id  uuid := gen_random_uuid();
  q2_id  uuid := gen_random_uuid();
  q3_id  uuid := gen_random_uuid();
  q4_id  uuid := gen_random_uuid();
  q5_id  uuid := gen_random_uuid();
  q6_id  uuid := gen_random_uuid();
  q7_id  uuid := gen_random_uuid();
  q8_id  uuid := gen_random_uuid();
  q9_id  uuid := gen_random_uuid();
  q10_id uuid := gen_random_uuid();
  q11_id uuid := gen_random_uuid();
  q12_id uuid := gen_random_uuid();
  q13_id uuid := gen_random_uuid();
  q14_id uuid := gen_random_uuid();
  q15_id uuid := gen_random_uuid();
  q16_id uuid := gen_random_uuid();
  q17_id uuid := gen_random_uuid();
  q18_id uuid := gen_random_uuid();
  q19_id uuid := gen_random_uuid();
  q20_id uuid := gen_random_uuid();

BEGIN

  -- -------------------------------------------------------------------------
  -- Quiz
  -- -------------------------------------------------------------------------
  INSERT INTO quizzes (id, title, description)
  VALUES (
    quiz_id,
    '🎉 Birthday Party Trivia',
    'Fun trivia for all ages — perfect for birthday parties!'
  );

  -- -------------------------------------------------------------------------
  -- Questions
  -- -------------------------------------------------------------------------
  INSERT INTO questions (id, quiz_id, question_text, timer_seconds, points, display_order) VALUES
    (q1_id,  quiz_id, 'What is the most popular ice cream flavor in the world?',   20, 500,  1),
    (q2_id,  quiz_id, 'How many colors are in a rainbow?',                         20, 500,  2),
    (q3_id,  quiz_id, 'Which planet is known as the Red Planet?',                  20, 1000, 3),
    (q4_id,  quiz_id, 'What year was the first iPhone released?',                  20, 1000, 4),
    (q5_id,  quiz_id, 'How many legs does a spider have?',                         20, 500,  5),
    (q6_id,  quiz_id, 'What is the fastest land animal?',                          15, 1000, 6),
    (q7_id,  quiz_id, 'How many days are in a leap year?',                         20, 1000, 7),
    (q8_id,  quiz_id, 'What do bees make?',                                        15, 500,  8),
    (q9_id,  quiz_id, 'Which ocean is the largest?',                               20, 1000, 9),
    (q10_id, quiz_id, 'How many sides does a hexagon have?',                       20, 500,  10),
    (q11_id, quiz_id, 'What is the capital of France?',                            20, 500,  11),
    (q12_id, quiz_id, 'How many players are on a basketball team on the court?',   20, 1000, 12),
    (q13_id, quiz_id, 'What year was Minecraft first released?',                   20, 1000, 13),
    (q14_id, quiz_id, 'What sound does a duck make?',                              15, 500,  14),
    (q15_id, quiz_id, 'How many cents are in a dollar?',                           20, 500,  15),
    (q16_id, quiz_id, 'Which fruit grows on a pineapple plant?',                   20, 1000, 16),
    (q17_id, quiz_id, 'How many seconds are in a minute?',                         15, 500,  17),
    (q18_id, quiz_id, 'What is 15% of 200?',                                       20, 1000, 18),
    (q19_id, quiz_id, 'Which animal is known as man''s best friend?',              20, 500,  19),
    (q20_id, quiz_id, 'How many teeth does an adult human normally have?',         20, 1000, 20);

  -- -------------------------------------------------------------------------
  -- Answer Options
  -- display_order: 0 = first option shown, 1, 2, 3
  -- -------------------------------------------------------------------------

  -- Q1: What is the most popular ice cream flavor in the world?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q1_id, 'Vanilla',    true,  0),
    (gen_random_uuid(), q1_id, 'Chocolate',  false, 1),
    (gen_random_uuid(), q1_id, 'Strawberry', false, 2),
    (gen_random_uuid(), q1_id, 'Mint Chip',  false, 3);

  -- Q2: How many colors are in a rainbow?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q2_id, '7', true,  0),
    (gen_random_uuid(), q2_id, '5', false, 1),
    (gen_random_uuid(), q2_id, '6', false, 2),
    (gen_random_uuid(), q2_id, '8', false, 3);

  -- Q3: Which planet is known as the Red Planet?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q3_id, 'Mars',    true,  0),
    (gen_random_uuid(), q3_id, 'Jupiter', false, 1),
    (gen_random_uuid(), q3_id, 'Venus',   false, 2),
    (gen_random_uuid(), q3_id, 'Saturn',  false, 3);

  -- Q4: What year was the first iPhone released?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q4_id, '2007', true,  0),
    (gen_random_uuid(), q4_id, '2005', false, 1),
    (gen_random_uuid(), q4_id, '2009', false, 2),
    (gen_random_uuid(), q4_id, '2003', false, 3);

  -- Q5: How many legs does a spider have?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q5_id, '8',  true,  0),
    (gen_random_uuid(), q5_id, '6',  false, 1),
    (gen_random_uuid(), q5_id, '10', false, 2),
    (gen_random_uuid(), q5_id, '4',  false, 3);

  -- Q6: What is the fastest land animal?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q6_id, 'Cheetah',          true,  0),
    (gen_random_uuid(), q6_id, 'Lion',              false, 1),
    (gen_random_uuid(), q6_id, 'Peregrine Falcon',  false, 2),
    (gen_random_uuid(), q6_id, 'Greyhound',         false, 3);

  -- Q7: How many days are in a leap year?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q7_id, '366', true,  0),
    (gen_random_uuid(), q7_id, '365', false, 1),
    (gen_random_uuid(), q7_id, '367', false, 2),
    (gen_random_uuid(), q7_id, '360', false, 3);

  -- Q8: What do bees make?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q8_id, 'Honey',  true,  0),
    (gen_random_uuid(), q8_id, 'Butter', false, 1),
    (gen_random_uuid(), q8_id, 'Nectar', false, 2),
    (gen_random_uuid(), q8_id, 'Wax',    false, 3);

  -- Q9: Which ocean is the largest?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q9_id, 'Pacific',  true,  0),
    (gen_random_uuid(), q9_id, 'Atlantic', false, 1),
    (gen_random_uuid(), q9_id, 'Indian',   false, 2),
    (gen_random_uuid(), q9_id, 'Arctic',   false, 3);

  -- Q10: How many sides does a hexagon have?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q10_id, '6', true,  0),
    (gen_random_uuid(), q10_id, '5', false, 1),
    (gen_random_uuid(), q10_id, '7', false, 2),
    (gen_random_uuid(), q10_id, '8', false, 3);

  -- Q11: What is the capital of France?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q11_id, 'Paris',  true,  0),
    (gen_random_uuid(), q11_id, 'London', false, 1),
    (gen_random_uuid(), q11_id, 'Berlin', false, 2),
    (gen_random_uuid(), q11_id, 'Rome',   false, 3);

  -- Q12: How many players are on a basketball team on the court?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q12_id, '5', true,  0),
    (gen_random_uuid(), q12_id, '6', false, 1),
    (gen_random_uuid(), q12_id, '4', false, 2),
    (gen_random_uuid(), q12_id, '7', false, 3);

  -- Q13: What year was Minecraft first released?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q13_id, '2011', true,  0),
    (gen_random_uuid(), q13_id, '2009', false, 1),
    (gen_random_uuid(), q13_id, '2013', false, 2),
    (gen_random_uuid(), q13_id, '2008', false, 3);

  -- Q14: What sound does a duck make?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q14_id, 'Quack', true,  0),
    (gen_random_uuid(), q14_id, 'Moo',   false, 1),
    (gen_random_uuid(), q14_id, 'Oink',  false, 2),
    (gen_random_uuid(), q14_id, 'Baa',   false, 3);

  -- Q15: How many cents are in a dollar?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q15_id, '100',  true,  0),
    (gen_random_uuid(), q15_id, '50',   false, 1),
    (gen_random_uuid(), q15_id, '10',   false, 2),
    (gen_random_uuid(), q15_id, '1000', false, 3);

  -- Q16: Which fruit grows on a pineapple plant?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q16_id, 'Pineapple', true,  0),
    (gen_random_uuid(), q16_id, 'Mango',     false, 1),
    (gen_random_uuid(), q16_id, 'Papaya',    false, 2),
    (gen_random_uuid(), q16_id, 'Coconut',   false, 3);

  -- Q17: How many seconds are in a minute?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q17_id, '60',  true,  0),
    (gen_random_uuid(), q17_id, '100', false, 1),
    (gen_random_uuid(), q17_id, '30',  false, 2),
    (gen_random_uuid(), q17_id, '120', false, 3);

  -- Q18: What is 15% of 200?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q18_id, '30', true,  0),
    (gen_random_uuid(), q18_id, '25', false, 1),
    (gen_random_uuid(), q18_id, '15', false, 2),
    (gen_random_uuid(), q18_id, '20', false, 3);

  -- Q19: Which animal is known as man's best friend?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q19_id, 'Dog',    true,  0),
    (gen_random_uuid(), q19_id, 'Cat',    false, 1),
    (gen_random_uuid(), q19_id, 'Horse',  false, 2),
    (gen_random_uuid(), q19_id, 'Rabbit', false, 3);

  -- Q20: How many teeth does an adult human normally have?
  INSERT INTO answer_options (id, question_id, answer_text, is_correct, display_order) VALUES
    (gen_random_uuid(), q20_id, '32', true,  0),
    (gen_random_uuid(), q20_id, '28', false, 1),
    (gen_random_uuid(), q20_id, '30', false, 2),
    (gen_random_uuid(), q20_id, '36', false, 3);

END $$;
