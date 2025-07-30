// MongoDB initialization script
db = db.getSiblingDB('teenup');

// Create application user
db.createUser({
    user: 'teenup_user',
    pwd: 'teenup_password',
    roles: [
        {
            role: 'readWrite',
            db: 'teenup'
        }
    ]
});

// Create collections with basic indexes
db.createCollection('parents');
db.createCollection('students');
db.createCollection('classes');
db.createCollection('classregistrations');
db.createCollection('subscriptions');

// Create indexes for better performance
db.parents.createIndex({ email: 1 }, { unique: true });
db.parents.createIndex({ phone: 1 }, { unique: true });

db.students.createIndex({ parent_id: 1 });

db.classes.createIndex({ day_of_week: 1 });
db.classes.createIndex({ day_of_week: 1, time_slot: 1 });

db.classregistrations.createIndex({ class_id: 1, student_id: 1 }, { unique: true });
db.classregistrations.createIndex({ student_id: 1 });

db.subscriptions.createIndex({ student_id: 1 });
db.subscriptions.createIndex({ status: 1 });

print('MongoDB initialization completed successfully!');
print('Database: teenup');
print('User: teenup_user created with readWrite permissions');
print('Collections and indexes created successfully'); 