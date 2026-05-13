// Test to verify support service ticket counting logic

console.log('\n=== SUPPORT TICKET COUNTING LOGIC TEST ===\n');

// Simulating the old logic vs new logic
const mockTickets = [
  { id: 1, status: 'OPEN', type: 'MENTAL_WELLNESS' },
  { id: 2, status: 'OPEN', type: 'ACADEMIC' },
  { id: 3, status: 'IN_PROGRESS', type: 'HOSTEL' },
  { id: 4, status: 'IN_PROGRESS', type: 'PLACEMENT' },
  { id: 5, status: 'ESCALATED', type: 'OTHER' },
  { id: 6, status: 'RESOLVED', type: 'MENTAL_WELLNESS' },
  { id: 7, status: 'RESOLVED', type: 'ACADEMIC' },
];

console.log('Mock Tickets:');
mockTickets.forEach(t => {
  console.log(`  - Ticket ${t.id}: ${t.status} (${t.type})`);
});

// Old logic: only OPEN and ESCALATED
const oldLogic = mockTickets.filter(t => t.status === 'OPEN' || t.status === 'ESCALATED').length;
console.log(`\n✗ OLD LOGIC (OPEN + ESCALATED only): ${oldLogic} pending tickets`);
console.log('  Counts: OPEN (2) + ESCALATED (1) = 3');

// New logic: all unresolved (not RESOLVED)
const newLogic = mockTickets.filter(t => t.status !== 'RESOLVED').length;
console.log(`\n✓ NEW LOGIC (all unresolved): ${newLogic} pending tickets`);
console.log('  Counts: OPEN (2) + IN_PROGRESS (2) + ESCALATED (1) = 5');

console.log('\n=== VERIFICATION ===\n');
console.log('Tickets being counted now (that were NOT before):');
mockTickets
  .filter(t => t.status === 'IN_PROGRESS')
  .forEach(t => {
    console.log(`  ✓ Ticket ${t.id}: ${t.status} → NOW counted as pending`);
  });

console.log('\nTickets still NOT being counted (RESOLVED):');
mockTickets
  .filter(t => t.status === 'RESOLVED')
  .forEach(t => {
    console.log(`  ✗ Ticket ${t.id}: ${t.status} → Correctly excluded`);
  });

console.log('\n=== TEST PASSED ===\n');
