// Test file to verify wellness calculator changes
const { getWellnessStatus, getLifestyleStatus, calculateFinalWellnessScore, calculateSectionScores } = require('./utils/wellnessCalculator');

console.log('\n=== WELLNESS STATUS TESTS ===\n');

const testScores = [10, 30, 50, 70, 90];
const expectedWellness = [
  { score: 10, label: 'Excellent', color: '#10B981' },
  { score: 30, label: 'Stable', color: '#34D399' },
  { score: 50, label: 'Initial Risk', color: '#FBBF24' },
  { score: 70, label: 'High Risk', color: '#F97316' },
  { score: 90, label: 'Critical', color: '#EF4444' }
];

console.log('Testing getWellnessStatus():');
expectedWellness.forEach(test => {
  const result = getWellnessStatus(test.score);
  const pass = result.label === test.label && result.color === test.color;
  const status = pass ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | Score: ${test.score} → Label: "${result.label}" (expected: "${test.label}"), Color: ${result.color}`);
});

console.log('\n=== LIFESTYLE STATUS TESTS ===\n');

const expectedLifestyle = [
  { score: 10, label: 'Healthy', color: '#10B981' },
  { score: 30, label: 'Stable', color: '#34D399' },
  { score: 50, label: 'Imbalanced', color: '#FBBF24' },
  { score: 70, label: 'Unhealthy', color: '#F97316' },
  { score: 90, label: 'Severe Lifestyle Risk', color: '#EF4444' }
];

console.log('Testing getLifestyleStatus():');
expectedLifestyle.forEach(test => {
  const result = getLifestyleStatus(test.score);
  const pass = result.label === test.label && result.color === test.color;
  const status = pass ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | Score: ${test.score} → Label: "${result.label}" (expected: "${test.label}"), Color: ${result.color}`);
});

console.log('\n=== SECTION SCORES CALCULATION TEST ===\n');

// Sample assessment data
const sampleAnswers = {
  // Mental (0-3 scale)
  m1_exhaustion: 2,
  m2_sleep: 1,
  m3_motivation: 2,
  m4_concentration: 1,
  m5_isolation: 0,
  // Academic (0-3 scale)
  a1_assignment: 1,
  a2_exam: 2,
  a3_backlog: 1,
  a4_time_mgmt: 2,
  a5_attendance: 0,
  // Hostel (1-5 Likert)
  h1_food: 4,
  h2_cleanliness: 3,
  h3_internet: 4,
  h4_noise: 3,
  h5_safety: 4,
  // Placement (0-3 scale)
  p1_anxiety: 1,
  p2_technical: 2,
  p3_resume: 1,
  p4_interview: 1,
  p5_unemployment: 2,
  // Lifestyle (0-3 scale)
  l1_physical: 1,
  l2_social: 2,
  l3_screen_time: 1,
  l4_sleep_routine: 2,
  l5_campus_activity: 1
};

const sections = calculateSectionScores(sampleAnswers);
console.log('Section Scores:');
console.log(`  Mental: ${sections.mental}`);
console.log(`  Academic: ${sections.academic}`);
console.log(`  Hostel: ${sections.hostel}`);
console.log(`  Placement: ${sections.placement}`);
console.log(`  Lifestyle: ${sections.lifestyle}`);

const finalScore = calculateFinalWellnessScore(sections);
console.log(`\nFinal Wellness Score: ${finalScore}`);
const finalStatus = getWellnessStatus(finalScore);
console.log(`Status: ${finalStatus.label} (Color: ${finalStatus.color})`);

console.log('\n=== ALL TESTS COMPLETED ===\n');
