import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding master tables...');

  // ─── Master Habits ────────────────────────────────────────────────────────
  // label is @unique in schema
  const habitsResult = await prisma.masterHabit.createMany({
    skipDuplicates: true,
    data: [
      // Lifestyle
      { category: 'lifestyle', label: 'Early Bird', icon_name: 'sunrise', display_order: 1 },
      { category: 'lifestyle', label: 'Night Owl', icon_name: 'moon', display_order: 2 },
      { category: 'lifestyle', label: 'Vegetarian', icon_name: 'leaf', display_order: 3 },
      { category: 'lifestyle', label: 'Vegan', icon_name: 'plant', display_order: 4 },
      { category: 'lifestyle', label: 'Non-Vegetarian', icon_name: 'meat', display_order: 5 },
      { category: 'lifestyle', label: 'Jain', icon_name: 'lotus', display_order: 6 },
      // Cleanliness
      { category: 'cleanliness', label: 'Very Neat', icon_name: 'sparkles', display_order: 10 },
      { category: 'cleanliness', label: 'Moderately Clean', icon_name: 'broom', display_order: 11 },
      { category: 'cleanliness', label: 'Relaxed about Cleanliness', icon_name: 'mop', display_order: 12 },
      // Social
      { category: 'social', label: 'Introvert', icon_name: 'book', display_order: 20 },
      { category: 'social', label: 'Extrovert', icon_name: 'people', display_order: 21 },
      { category: 'social', label: 'Homebody', icon_name: 'home', display_order: 22 },
      { category: 'social', label: 'Party-Lover', icon_name: 'party', display_order: 23 },
      { category: 'social', label: 'Okay with Guests', icon_name: 'door', display_order: 24 },
      { category: 'social', label: 'No Guests Please', icon_name: 'no-entry', display_order: 25 },
      // Work & Study
      { category: 'work', label: 'Work from Home', icon_name: 'laptop', display_order: 30 },
      { category: 'work', label: 'Office Goer', icon_name: 'briefcase', display_order: 31 },
      { category: 'work', label: 'Student', icon_name: 'graduation-cap', display_order: 32 },
      // Preferences
      { category: 'preferences', label: 'Pet Owner', icon_name: 'paw', display_order: 40 },
      { category: 'preferences', label: 'Pet-Friendly', icon_name: 'heart-paw', display_order: 41 },
      { category: 'preferences', label: 'No Pets Please', icon_name: 'no-pets', display_order: 42 },
      { category: 'preferences', label: 'Smoker', icon_name: 'smoke', display_order: 43 },
      { category: 'preferences', label: 'Non-Smoker', icon_name: 'no-smoke', display_order: 44 },
      { category: 'preferences', label: 'Drinker', icon_name: 'drink', display_order: 45 },
      { category: 'preferences', label: 'Non-Drinker', icon_name: 'no-drink', display_order: 46 },
      // Fitness
      { category: 'fitness', label: 'Gym Enthusiast', icon_name: 'dumbbell', display_order: 50 },
      { category: 'fitness', label: 'Yoga Practitioner', icon_name: 'yoga', display_order: 51 },
      { category: 'fitness', label: 'Runner', icon_name: 'running', display_order: 52 },
    ],
  });
  console.log(`  ✅ Seeded habits (+${habitsResult.count})`);

  // ─── Master Amenities ─────────────────────────────────────────────────────
  // name is @unique in schema
  const amenitiesResult = await prisma.masterAmenity.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Air Conditioning', amenity_type: 'room', icon_name: 'ac', display_order: 1 },
      { name: 'AC', amenity_type: 'room', icon_name: 'ac', display_order: 1 },
      { name: 'Attached Bathroom', amenity_type: 'room', icon_name: 'bath', display_order: 2 },
      { name: 'Wardrobe', amenity_type: 'room', icon_name: 'wardrobe', display_order: 3 },
      { name: 'Study Table', amenity_type: 'room', icon_name: 'desk', display_order: 4 },
      { name: 'Balcony', amenity_type: 'room', icon_name: 'balcony', display_order: 5 },
      { name: 'Bed', amenity_type: 'room', icon_name: 'bed', display_order: 6 },
      { name: 'WiFi', amenity_type: 'flat', icon_name: 'wifi', display_order: 10 },
      { name: 'Power Backup', amenity_type: 'flat', icon_name: 'lightning', display_order: 11 },
      { name: 'Kitchen', amenity_type: 'flat', icon_name: 'kitchen', display_order: 11.5 },
      { name: 'CCTV', amenity_type: 'flat', icon_name: 'camera', display_order: 12 },
      { name: 'Security Guard', amenity_type: 'flat', icon_name: 'shield', display_order: 13 },
      { name: 'Lift', amenity_type: 'flat', icon_name: 'elevator', display_order: 14 },
      { name: 'Parking', amenity_type: 'flat', icon_name: 'car', display_order: 15 },
      { name: 'Gym', amenity_type: 'flat', icon_name: 'dumbbell', display_order: 16 },
      { name: 'Swimming Pool', amenity_type: 'flat', icon_name: 'pool', display_order: 17 },
      { name: 'Washing Machine', amenity_type: 'flat', icon_name: 'washing-machine', display_order: 18 },
      { name: 'Fridge', amenity_type: 'flat', icon_name: 'fridge', display_order: 19 },
      { name: 'Gas Pipeline', amenity_type: 'flat', icon_name: 'gas', display_order: 20 },
      { name: 'Water Filter/Purifier', amenity_type: 'flat', icon_name: 'water-drop', display_order: 21 },
    ],
  });
  console.log(`  ✅ Seeded amenities (+${amenitiesResult.count})`);

  // ─── Master Degrees ───────────────────────────────────────────────────────
  // common_name is @unique in schema
  const degreesResult = await prisma.masterDegree.createMany({
    skipDuplicates: true,
    data: [
      { full_name: 'Bachelor of Technology', common_name: 'B.Tech', other_names: ['BTech'] },
      { full_name: 'Bachelor of Engineering', common_name: 'B.E.', other_names: ['BE'] },
      { full_name: 'Bachelor of Science', common_name: 'B.Sc.', other_names: ['BSc'] },
      { full_name: 'Bachelor of Commerce', common_name: 'B.Com', other_names: ['BCom'] },
      { full_name: 'Bachelor of Arts', common_name: 'B.A.', other_names: ['BA'] },
      { full_name: 'Bachelor of Business Administration', common_name: 'BBA', other_names: [] },
      { full_name: 'Bachelor of Computer Applications', common_name: 'BCA', other_names: [] },
      { full_name: 'Master of Technology', common_name: 'M.Tech', other_names: ['MTech'] },
      { full_name: 'Master of Science', common_name: 'M.Sc.', other_names: ['MSc'] },
      { full_name: 'Master of Business Administration', common_name: 'MBA', other_names: [] },
      { full_name: 'Master of Computer Applications', common_name: 'MCA', other_names: [] },
      { full_name: 'Master of Arts', common_name: 'M.A.', other_names: ['MA'] },
      { full_name: 'Doctor of Philosophy', common_name: 'Ph.D.', other_names: ['PhD'] },
      { full_name: 'Chartered Accountancy', common_name: 'CA', other_names: [] },
      { full_name: 'Company Secretary', common_name: 'CS', other_names: [] },
      { full_name: 'Bachelor of Medicine and Surgery', common_name: 'MBBS', other_names: [] },
      { full_name: 'Bachelor of Laws', common_name: 'LLB', other_names: ['LL.B.'] },
      { full_name: 'Bachelor of Design', common_name: 'B.Des.', other_names: ['BDes'] },
      { full_name: 'Diploma', common_name: 'Diploma', other_names: [] },
      { full_name: 'High School (10th)', common_name: '10th', other_names: ['SSC', 'SSLC'] },
      { full_name: 'Higher Secondary (12th)', common_name: '12th', other_names: ['HSC', 'Intermediate'] },
    ],
  });
  console.log(`  ✅ Seeded degrees (+${degreesResult.count})`);

  // ─── Master Positions ─────────────────────────────────────────────────────
  // common_name is @unique in schema
  const positionsResult = await prisma.masterPosition.createMany({
    skipDuplicates: true,
    data: [
      { full_name: 'Software Engineer', common_name: 'SWE', other_names: ['Software Developer', 'Dev'] },
      { full_name: 'Senior Software Engineer', common_name: 'Senior SWE', other_names: ['Senior Dev'] },
      { full_name: 'Frontend Developer', common_name: 'Frontend Dev', other_names: ['UI Developer'] },
      { full_name: 'Backend Developer', common_name: 'Backend Dev', other_names: [] },
      { full_name: 'Full Stack Developer', common_name: 'Full Stack Dev', other_names: ['Fullstack'] },
      { full_name: 'Data Scientist', common_name: 'Data Scientist', other_names: [] },
      { full_name: 'Data Analyst', common_name: 'Data Analyst', other_names: [] },
      { full_name: 'Machine Learning Engineer', common_name: 'ML Engineer', other_names: ['AI Engineer'] },
      { full_name: 'DevOps Engineer', common_name: 'DevOps', other_names: ['SRE'] },
      { full_name: 'Product Manager', common_name: 'PM', other_names: ['Product Manager'] },
      { full_name: 'Product Designer', common_name: 'Designer', other_names: ['UX Designer', 'UI/UX Designer'] },
      { full_name: 'QA Engineer', common_name: 'QA', other_names: ['Test Engineer', 'SDET'] },
      { full_name: 'Business Analyst', common_name: 'BA', other_names: ['Business Analyst'] },
      { full_name: 'Sales Executive', common_name: 'Sales', other_names: ['BDE'] },
      { full_name: 'Marketing Manager', common_name: 'Marketing', other_names: [] },
      { full_name: 'Human Resources Manager', common_name: 'HR', other_names: ['HR Manager', 'People Ops'] },
      { full_name: 'Finance Analyst', common_name: 'Finance Analyst', other_names: [] },
      { full_name: 'Chartered Accountant', common_name: 'Chartered Accountant', other_names: [] },
      { full_name: 'Consultant', common_name: 'Consultant', other_names: [] },
      { full_name: 'Intern', common_name: 'Intern', other_names: ['Trainee'] },
      { full_name: 'Freelancer', common_name: 'Freelancer', other_names: ['Independent Contractor'] },
    ],
  });
  console.log(`  ✅ Seeded positions (+${positionsResult.count})`);

  // ─── Master Companies ─────────────────────────────────────────────────────
  // name is NOT @unique — use raw SQL insert with ON CONFLICT DO NOTHING
  await prisma.$executeRaw`
    INSERT INTO master_companies (id, name, aliases, website, status)
    VALUES
      (gen_random_uuid(), 'Google', ARRAY['Alphabet'], 'https://google.com', 'active'),
      (gen_random_uuid(), 'Microsoft', ARRAY['MSFT'], 'https://microsoft.com', 'active'),
      (gen_random_uuid(), 'Amazon', ARRAY['AWS', 'Amazon Web Services'], 'https://amazon.com', 'active'),
      (gen_random_uuid(), 'Meta', ARRAY['Facebook', 'Instagram'], 'https://meta.com', 'active'),
      (gen_random_uuid(), 'Apple', ARRAY[]::text[], 'https://apple.com', 'active'),
      (gen_random_uuid(), 'Flipkart', ARRAY[]::text[], 'https://flipkart.com', 'active'),
      (gen_random_uuid(), 'Swiggy', ARRAY[]::text[], 'https://swiggy.com', 'active'),
      (gen_random_uuid(), 'Zomato', ARRAY[]::text[], 'https://zomato.com', 'active'),
      (gen_random_uuid(), 'Razorpay', ARRAY[]::text[], 'https://razorpay.com', 'active'),
      (gen_random_uuid(), 'CRED', ARRAY[]::text[], 'https://cred.club', 'active'),
      (gen_random_uuid(), 'Paytm', ARRAY['One97 Communications'], 'https://paytm.com', 'active'),
      (gen_random_uuid(), 'PhonePe', ARRAY[]::text[], 'https://phonepe.com', 'active'),
      (gen_random_uuid(), 'Infosys', ARRAY[]::text[], 'https://infosys.com', 'active'),
      (gen_random_uuid(), 'TCS', ARRAY['Tata Consultancy Services'], 'https://tcs.com', 'active'),
      (gen_random_uuid(), 'Wipro', ARRAY[]::text[], 'https://wipro.com', 'active'),
      (gen_random_uuid(), 'HCL Technologies', ARRAY['HCL'], 'https://hcltech.com', 'active'),
      (gen_random_uuid(), 'Accenture', ARRAY[]::text[], 'https://accenture.com', 'active'),
      (gen_random_uuid(), 'Deloitte', ARRAY[]::text[], 'https://deloitte.com', 'active'),
      (gen_random_uuid(), 'Goldman Sachs', ARRAY['GS'], 'https://goldmansachs.com', 'active'),
      (gen_random_uuid(), 'JP Morgan', ARRAY['JPMorgan Chase'], 'https://jpmorgan.com', 'active'),
      (gen_random_uuid(), 'Ola', ARRAY['Ola Cabs', 'ANI Technologies'], 'https://olacabs.com', 'active'),
      (gen_random_uuid(), 'Uber', ARRAY[]::text[], 'https://uber.com', 'active'),
      (gen_random_uuid(), 'Meesho', ARRAY[]::text[], 'https://meesho.com', 'active'),
      (gen_random_uuid(), 'Dream11', ARRAY[]::text[], 'https://dream11.com', 'active'),
      (gen_random_uuid(), 'Byju''s', ARRAY['Think and Learn'], 'https://byjus.com', 'active'),
      (gen_random_uuid(), 'Unacademy', ARRAY[]::text[], 'https://unacademy.com', 'active'),
      (gen_random_uuid(), 'Zepto', ARRAY[]::text[], 'https://zepto.in', 'active'),
      (gen_random_uuid(), 'BigBasket', ARRAY[]::text[], 'https://bigbasket.com', 'active'),
      (gen_random_uuid(), 'Nykaa', ARRAY['FSN E-Commerce'], 'https://nykaa.com', 'active'),
      (gen_random_uuid(), 'Dunzo', ARRAY[]::text[], 'https://dunzo.com', 'active')
    ON CONFLICT DO NOTHING
  `;
  const companiesCount = await prisma.masterCompany.count();
  console.log(`  ✅ Seeded companies (total: ${companiesCount})`);

  // ─── Master Institutions ──────────────────────────────────────────────────
  // name is NOT @unique — use raw SQL insert with ON CONFLICT DO NOTHING
  await prisma.$executeRaw`
    INSERT INTO master_institutions (id, name, aliases, city, state, status)
    VALUES
      (gen_random_uuid(), 'IIT Bombay', ARRAY['IITB'], 'Mumbai', 'Maharashtra', 'active'),
      (gen_random_uuid(), 'IIT Delhi', ARRAY['IITD'], 'New Delhi', 'Delhi', 'active'),
      (gen_random_uuid(), 'IIT Madras', ARRAY['IITM'], 'Chennai', 'Tamil Nadu', 'active'),
      (gen_random_uuid(), 'IIT Kanpur', ARRAY['IITK'], 'Kanpur', 'Uttar Pradesh', 'active'),
      (gen_random_uuid(), 'IIT Kharagpur', ARRAY['IITKgp'], 'Kharagpur', 'West Bengal', 'active'),
      (gen_random_uuid(), 'IIT Roorkee', ARRAY['IITR'], 'Roorkee', 'Uttarakhand', 'active'),
      (gen_random_uuid(), 'IIT Hyderabad', ARRAY['IITH'], 'Hyderabad', 'Telangana', 'active'),
      (gen_random_uuid(), 'IISc Bangalore', ARRAY['IISc'], 'Bengaluru', 'Karnataka', 'active'),
      (gen_random_uuid(), 'IIM Ahmedabad', ARRAY['IIMA'], 'Ahmedabad', 'Gujarat', 'active'),
      (gen_random_uuid(), 'IIM Bangalore', ARRAY['IIMB'], 'Bengaluru', 'Karnataka', 'active'),
      (gen_random_uuid(), 'IIM Calcutta', ARRAY['IIMC'], 'Kolkata', 'West Bengal', 'active'),
      (gen_random_uuid(), 'IIM Lucknow', ARRAY['IIML'], 'Lucknow', 'Uttar Pradesh', 'active'),
      (gen_random_uuid(), 'NIT Trichy', ARRAY['NITT', 'NIT Tiruchirappalli'], 'Tiruchirappalli', 'Tamil Nadu', 'active'),
      (gen_random_uuid(), 'NIT Surathkal', ARRAY['NITK'], 'Surathkal', 'Karnataka', 'active'),
      (gen_random_uuid(), 'NIT Warangal', ARRAY['NITW'], 'Warangal', 'Telangana', 'active'),
      (gen_random_uuid(), 'Delhi University', ARRAY['DU', 'University of Delhi'], 'New Delhi', 'Delhi', 'active'),
      (gen_random_uuid(), 'Mumbai University', ARRAY['MU', 'University of Mumbai'], 'Mumbai', 'Maharashtra', 'active'),
      (gen_random_uuid(), 'Pune University', ARRAY['SPPU', 'Savitribai Phule Pune University'], 'Pune', 'Maharashtra', 'active'),
      (gen_random_uuid(), 'Anna University', ARRAY[]::text[], 'Chennai', 'Tamil Nadu', 'active'),
      (gen_random_uuid(), 'Osmania University', ARRAY['OU'], 'Hyderabad', 'Telangana', 'active'),
      (gen_random_uuid(), 'VTU', ARRAY['Visvesvaraya Technological University'], 'Belagavi', 'Karnataka', 'active'),
      (gen_random_uuid(), 'BITS Pilani', ARRAY['BITS'], 'Pilani', 'Rajasthan', 'active'),
      (gen_random_uuid(), 'Manipal University', ARRAY['MAHE', 'MIT Manipal'], 'Manipal', 'Karnataka', 'active'),
      (gen_random_uuid(), 'SRM University', ARRAY['SRMIST'], 'Chennai', 'Tamil Nadu', 'active'),
      (gen_random_uuid(), 'VIT University', ARRAY['VIT'], 'Vellore', 'Tamil Nadu', 'active'),
      (gen_random_uuid(), 'Amity University', ARRAY[]::text[], 'Noida', 'Uttar Pradesh', 'active'),
      (gen_random_uuid(), 'Christ University', ARRAY[]::text[], 'Bengaluru', 'Karnataka', 'active'),
      (gen_random_uuid(), 'Jadavpur University', ARRAY['JU'], 'Kolkata', 'West Bengal', 'active'),
      (gen_random_uuid(), 'Calcutta University', ARRAY['CU'], 'Kolkata', 'West Bengal', 'active'),
      (gen_random_uuid(), 'Hyderabad Central University', ARRAY['HCU', 'UoH'], 'Hyderabad', 'Telangana', 'active')
    ON CONFLICT DO NOTHING
  `;
  const institutionsCount = await prisma.masterInstitution.count();
  console.log(`  ✅ Seeded institutions (total: ${institutionsCount})`);

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
