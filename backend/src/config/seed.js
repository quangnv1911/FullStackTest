const mongoose = require('mongoose');
const connectDB = require('./database');

// Import models
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Class = require('../models/Class');
const ClassRegistration = require('../models/ClassRegistration');
const Subscription = require('../models/Subscription');

const seedData = async () => {
    try {
        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await Parent.deleteMany({});
        await Student.deleteMany({});
        await Class.deleteMany({});
        await ClassRegistration.deleteMany({});
        await Subscription.deleteMany({});

        // Create Parents
        console.log('Creating parents...');
        const parents = await Parent.create([
            {
                name: 'Nguyễn Văn An',
                phone: '0123456789',
                email: 'an.nguyen@email.com'
            },
            {
                name: 'Trần Thị Bình',
                phone: '0987654321',
                email: 'binh.tran@email.com'
            },
            {
                name: 'Lê Minh Cường',
                phone: '0369852147',
                email: 'cuong.le@email.com'
            }
        ]);

        console.log(`Created ${parents.length} parents`);

        // Create Students
        console.log('Creating students...');
        const students = await Student.create([
            {
                name: 'Nguyễn Minh Anh',
                dob: new Date('2010-05-15'),
                gender: 'female',
                current_grade: 'Grade 8',
                parent_id: parents[0]._id
            },
            {
                name: 'Nguyễn Hoàng Nam',
                dob: new Date('2012-03-22'),
                gender: 'male',
                current_grade: 'Grade 6',
                parent_id: parents[0]._id
            },
            {
                name: 'Trần Thùy Linh',
                dob: new Date('2011-08-10'),
                gender: 'female',
                current_grade: 'Grade 7',
                parent_id: parents[1]._id
            },
            {
                name: 'Lê Đức Minh',
                dob: new Date('2009-12-05'),
                gender: 'male',
                current_grade: 'Grade 9',
                parent_id: parents[2]._id
            }
        ]);

        console.log(`Created ${students.length} students`);

        // Create Classes
        console.log('Creating classes...');
        const classes = await Class.create([
            {
                name: 'Toán học cơ bản',
                subject: 'Mathematics',
                day_of_week: 'monday',
                time_slot: '09:00-10:30',
                teacher_name: 'Cô Lan Anh',
                max_students: 15
            },
            {
                name: 'Tiếng Anh giao tiếp',
                subject: 'English',
                day_of_week: 'wednesday',
                time_slot: '14:00-15:30',
                teacher_name: 'Thầy John Smith',
                max_students: 12
            },
            {
                name: 'Vật lý thí nghiệm',
                subject: 'Physics',
                day_of_week: 'friday',
                time_slot: '10:00-11:30',
                teacher_name: 'Thầy Minh Tuấn',
                max_students: 10
            },
            {
                name: 'Lịch sử Việt Nam',
                subject: 'History',
                day_of_week: 'tuesday',
                time_slot: '15:00-16:30',
                teacher_name: 'Cô Thu Hương',
                max_students: 20
            },
            {
                name: 'Hóa học cơ bản',
                subject: 'Chemistry',
                day_of_week: 'thursday',
                time_slot: '08:00-09:30',
                teacher_name: 'Thầy Văn Dũng',
                max_students: 12
            }
        ]);

        console.log(`Created ${classes.length} classes`);

        // Create Subscriptions
        console.log('Creating subscriptions...');
        const subscriptions = await Subscription.create([
            {
                student_id: students[0]._id,
                package_name: 'Gói học 3 tháng',
                start_date: new Date(),
                end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
                total_sessions: 24,
                used_sessions: 5
            },
            {
                student_id: students[1]._id,
                package_name: 'Gói học 6 tháng',
                start_date: new Date(),
                end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days from now
                total_sessions: 48,
                used_sessions: 2
            },
            {
                student_id: students[2]._id,
                package_name: 'Gói học 1 tháng',
                start_date: new Date(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                total_sessions: 8,
                used_sessions: 0
            }
        ]);

        console.log(`Created ${subscriptions.length} subscriptions`);

        // Create Class Registrations
        console.log('Creating class registrations...');
        const registrations = await ClassRegistration.create([
            {
                class_id: classes[0]._id, // Toán học
                student_id: students[0]._id // Minh Anh
            },
            {
                class_id: classes[1]._id, // Tiếng Anh
                student_id: students[0]._id // Minh Anh
            },
            {
                class_id: classes[0]._id, // Toán học
                student_id: students[1]._id // Hoàng Nam
            },
            {
                class_id: classes[3]._id, // Lịch sử
                student_id: students[2]._id // Thùy Linh
            },
            {
                class_id: classes[2]._id, // Vật lý
                student_id: students[3]._id // Đức Minh
            }
        ]);

        console.log(`Created ${registrations.length} class registrations`);

        console.log('✅ Seed data created successfully!');
        console.log('\nSample data summary:');
        console.log(`- ${parents.length} parents`);
        console.log(`- ${students.length} students`);
        console.log(`- ${classes.length} classes`);
        console.log(`- ${subscriptions.length} subscriptions`);
        console.log(`- ${registrations.length} class registrations`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

// Run seed if called directly
if (require.main === module) {
    seedData();
}

module.exports = seedData; 