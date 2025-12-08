import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { User } from './models/User.model';
import { Ticket } from './models/Ticket.model';
import { Category } from './models/Category.model';
import { ROLES, TICKET_STATUS, PRIORITY } from './config/constants';

const seedData = async () => {
  try {
    await connectDatabase();
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const admin = await User.create({
      email: 'admin@company.com',
      password: 'admin123',
      name: 'Admin User',
      role: ROLES.ADMIN,
      department: 'IT',
      isActive: true,
    });
    console.log('✓ Created Admin:', admin.email);

    // Create Agent
    const agent = await User.create({
      email: 'agent@company.com',
      password: 'agent123',
      name: 'Support Agent',
      role: ROLES.AGENT,
      department: 'IT Support',
      isActive: true,
    });
    console.log('✓ Created Agent:', agent.email);

    // Create Employees
    const employee1 = await User.create({
      email: 'john.doe@company.com',
      password: 'employee123',
      name: 'John Doe',
      role: ROLES.EMPLOYEE,
      department: 'Sales',
      isActive: true,
    });
    console.log('✓ Created Employee:', employee1.email);

    const employee2 = await User.create({
      email: 'jane.smith@company.com',
      password: 'employee123',
      name: 'Jane Smith',
      role: ROLES.EMPLOYEE,
      department: 'Marketing',
      isActive: true,
    });
    console.log('✓ Created Employee:', employee2.email);

    const employee3 = await User.create({
      email: 'bob.wilson@company.com',
      password: 'employee123',
      name: 'Bob Wilson',
      role: ROLES.EMPLOYEE,
      department: 'HR',
      isActive: true,
    });
    console.log('✓ Created Employee:', employee3.email);

    // Create Categories
    const hardwareCategory = await Category.create({
      name: 'Hardware',
      type: 'Hardware',
      subcategories: ['Desktop', 'Laptop', 'Printer', 'Monitor', 'Keyboard', 'Mouse'],
      isActive: true,
    });

    const softwareCategory = await Category.create({
      name: 'Software',
      type: 'Software',
      subcategories: ['OS Issues', 'Application Error', 'Installation', 'License', 'Email'],
      isActive: true,
    });

    const networkCategory = await Category.create({
      name: 'Network',
      type: 'Hardware',
      subcategories: ['Internet', 'WiFi', 'VPN', 'Server Access'],
      isActive: true,
    });

    console.log('✓ Created Categories');

    // Create Tickets
    const ticket1 = await Ticket.create({
      type: 'Hardware',
      category: hardwareCategory._id,
      subcategory: 'Laptop',
      description: 'My laptop is running very slow and freezing frequently. It takes forever to open applications.',
      priority: PRIORITY.HIGH,
      status: TICKET_STATUS.IN_PROGRESS,
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

    const ticket2 = await Ticket.create({
      type: 'Software',
      category: softwareCategory._id,
      subcategory: 'Email',
      description: 'Cannot access my email. Getting authentication error when trying to log in.',
      priority: PRIORITY.CRITICAL,
      status: TICKET_STATUS.OPEN,
      createdBy: employee2._id,
    });
    console.log('✓ Created Ticket 2:', ticket2.ticketId);

    const ticket3 = await Ticket.create({
      type: 'Hardware',
      category: hardwareCategory._id,
      subcategory: 'Printer',
      description: 'Office printer is not responding. Shows offline status even though it is connected.',
      priority: PRIORITY.MEDIUM,
      status: TICKET_STATUS.OPEN,
      createdBy: employee3._id,
    });
    console.log('✓ Created Ticket 3:', ticket3.ticketId);

    const ticket4 = await Ticket.create({
      type: 'Hardware',
      category: networkCategory._id,
      subcategory: 'WiFi',
      description: 'WiFi connection keeps dropping in the conference room.',
      priority: PRIORITY.LOW,
      status: TICKET_STATUS.RESOLVED,
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

    const ticket5 = await Ticket.create({
      type: 'Software',
      category: softwareCategory._id,
      subcategory: 'Application Error',
      description: 'MS Excel crashes when opening large files. Need urgent help as I have a presentation tomorrow.',
      priority: PRIORITY.HIGH,
      status: TICKET_STATUS.OPEN,
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
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
