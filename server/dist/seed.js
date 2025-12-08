"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const User_model_1 = require("./models/User.model");
const Ticket_model_1 = require("./models/Ticket.model");
const Category_model_1 = require("./models/Category.model");
const constants_1 = require("./config/constants");
const seedData = async () => {
    try {
        await (0, database_1.connectDatabase)();
        console.log('Connected to database');
        // Clear existing data
        await User_model_1.User.deleteMany({});
        await Ticket_model_1.Ticket.deleteMany({});
        await Category_model_1.Category.deleteMany({});
        console.log('Cleared existing data');
        // Create Admin
        const admin = await User_model_1.User.create({
            email: 'admin@company.com',
            password: 'admin123',
            name: 'Admin User',
            role: constants_1.ROLES.ADMIN,
            department: 'IT',
            isActive: true,
        });
        console.log('✓ Created Admin:', admin.email);
        // Create Agent
        const agent = await User_model_1.User.create({
            email: 'agent@company.com',
            password: 'agent123',
            name: 'Support Agent',
            role: constants_1.ROLES.AGENT,
            department: 'IT Support',
            isActive: true,
        });
        console.log('✓ Created Agent:', agent.email);
        // Create Employees
        const employee1 = await User_model_1.User.create({
            email: 'john.doe@company.com',
            password: 'employee123',
            name: 'John Doe',
            role: constants_1.ROLES.EMPLOYEE,
            department: 'Sales',
            isActive: true,
        });
        console.log('✓ Created Employee:', employee1.email);
        const employee2 = await User_model_1.User.create({
            email: 'jane.smith@company.com',
            password: 'employee123',
            name: 'Jane Smith',
            role: constants_1.ROLES.EMPLOYEE,
            department: 'Marketing',
            isActive: true,
        });
        console.log('✓ Created Employee:', employee2.email);
        const employee3 = await User_model_1.User.create({
            email: 'bob.wilson@company.com',
            password: 'employee123',
            name: 'Bob Wilson',
            role: constants_1.ROLES.EMPLOYEE,
            department: 'HR',
            isActive: true,
        });
        console.log('✓ Created Employee:', employee3.email);
        // Create Categories
        const hardwareCategory = await Category_model_1.Category.create({
            name: 'Hardware',
            type: 'Hardware',
            subcategories: ['Desktop', 'Laptop', 'Printer', 'Monitor', 'Keyboard', 'Mouse'],
            isActive: true,
        });
        const softwareCategory = await Category_model_1.Category.create({
            name: 'Software',
            type: 'Software',
            subcategories: ['OS Issues', 'Application Error', 'Installation', 'License', 'Email'],
            isActive: true,
        });
        const networkCategory = await Category_model_1.Category.create({
            name: 'Network',
            type: 'Hardware',
            subcategories: ['Internet', 'WiFi', 'VPN', 'Server Access'],
            isActive: true,
        });
        console.log('✓ Created Categories');
        // Create Tickets
        const ticket1 = await Ticket_model_1.Ticket.create({
            type: 'Hardware',
            category: hardwareCategory._id,
            subcategory: 'Laptop',
            description: 'My laptop is running very slow and freezing frequently. It takes forever to open applications.',
            priority: constants_1.PRIORITY.HIGH,
            status: constants_1.TICKET_STATUS.IN_PROGRESS,
            createdBy: employee1._id,
            assignedTo: agent._id,
            comments: [
                {
                    user: agent._id,
                    userName: agent.name,
                    text: 'I will check this issue. Please make sure all applications are closed.',
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                },
                {
                    user: employee1._id,
                    userName: employee1.name,
                    text: 'I have closed all applications but the issue persists.',
                    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                },
            ],
        });
        console.log('✓ Created Ticket 1:', ticket1.ticketId);
        const ticket2 = await Ticket_model_1.Ticket.create({
            type: 'Software',
            category: softwareCategory._id,
            subcategory: 'Email',
            description: 'Cannot access my email. Getting authentication error when trying to log in.',
            priority: constants_1.PRIORITY.CRITICAL,
            status: constants_1.TICKET_STATUS.OPEN,
            createdBy: employee2._id,
        });
        console.log('✓ Created Ticket 2:', ticket2.ticketId);
        const ticket3 = await Ticket_model_1.Ticket.create({
            type: 'Hardware',
            category: hardwareCategory._id,
            subcategory: 'Printer',
            description: 'Office printer is not responding. Shows offline status even though it is connected.',
            priority: constants_1.PRIORITY.MEDIUM,
            status: constants_1.TICKET_STATUS.OPEN,
            createdBy: employee3._id,
        });
        console.log('✓ Created Ticket 3:', ticket3.ticketId);
        const ticket4 = await Ticket_model_1.Ticket.create({
            type: 'Hardware',
            category: networkCategory._id,
            subcategory: 'WiFi',
            description: 'WiFi connection keeps dropping in the conference room.',
            priority: constants_1.PRIORITY.LOW,
            status: constants_1.TICKET_STATUS.RESOLVED,
            createdBy: employee1._id,
            assignedTo: agent._id,
            resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            comments: [
                {
                    user: agent._id,
                    userName: agent.name,
                    text: 'Fixed the WiFi router. Please check if it is working now.',
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            ],
        });
        console.log('✓ Created Ticket 4:', ticket4.ticketId);
        const ticket5 = await Ticket_model_1.Ticket.create({
            type: 'Software',
            category: softwareCategory._id,
            subcategory: 'Application Error',
            description: 'MS Excel crashes when opening large files. Need urgent help as I have a presentation tomorrow.',
            priority: constants_1.PRIORITY.HIGH,
            status: constants_1.TICKET_STATUS.OPEN,
            createdBy: employee2._id,
        });
        console.log('✓ Created Ticket 5:', ticket5.ticketId);
        console.log('\n========================================');
        console.log('Seed completed successfully!');
        console.log('========================================\n');
        console.log('Login Credentials:');
        console.log('------------------');
        console.log('Admin:');
        console.log('  Email: admin@company.com');
        console.log('  Password: admin123\n');
        console.log('Agent:');
        console.log('  Email: agent@company.com');
        console.log('  Password: agent123\n');
        console.log('Employees:');
        console.log('  Email: john.doe@company.com');
        console.log('  Password: employee123\n');
        console.log('  Email: jane.smith@company.com');
        console.log('  Password: employee123\n');
        console.log('  Email: bob.wilson@company.com');
        console.log('  Password: employee123\n');
        console.log('========================================\n');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seed.js.map