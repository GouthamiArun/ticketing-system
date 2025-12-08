import { z } from 'zod';
export declare const signupSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    department: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    department?: string | undefined;
}, {
    email: string;
    password: string;
    name: string;
    department?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createTicketSchema: z.ZodObject<{
    type: z.ZodEnum<["Hardware", "Software"]>;
    category: z.ZodString;
    subcategory: z.ZodString;
    description: z.ZodString;
    priority: z.ZodEnum<["Low", "Medium", "High", "Critical"]>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "Hardware" | "Software";
    description: string;
    category: string;
    subcategory: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    attachments?: string[] | undefined;
}, {
    type: "Hardware" | "Software";
    description: string;
    category: string;
    subcategory: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    attachments?: string[] | undefined;
}>;
export declare const createServiceRequestSchema: z.ZodObject<{
    serviceType: z.ZodEnum<["IT assistance to trainings", "IT assistance to workshops", "IT assistance to Writeshops"]>;
    dateFrom: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    dateTo: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    duration: z.ZodString;
    typeOfService: z.ZodEnum<["Equipment setup", "Equipment and handholding"]>;
    type: z.ZodEnum<["Hardware", "Software"]>;
    category: z.ZodString;
    subcategory: z.ZodString;
    description: z.ZodString;
    priority: z.ZodEnum<["Low", "Medium", "High", "Critical"]>;
}, "strip", z.ZodTypeAny, {
    type: "Hardware" | "Software";
    description: string;
    category: string;
    subcategory: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    serviceType: "IT assistance to trainings" | "IT assistance to workshops" | "IT assistance to Writeshops";
    dateFrom: string | Date;
    dateTo: string | Date;
    duration: string;
    typeOfService: "Equipment setup" | "Equipment and handholding";
}, {
    type: "Hardware" | "Software";
    description: string;
    category: string;
    subcategory: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    serviceType: "IT assistance to trainings" | "IT assistance to workshops" | "IT assistance to Writeshops";
    dateFrom: string | Date;
    dateTo: string | Date;
    duration: string;
    typeOfService: "Equipment setup" | "Equipment and handholding";
}>;
export declare const updateTicketSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["Open", "In Progress", "Resolved", "Closed", "Rejected"]>>;
    priority: z.ZodOptional<z.ZodEnum<["Low", "Medium", "High", "Critical"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    priority?: "Low" | "Medium" | "High" | "Critical" | undefined;
    status?: "Open" | "In Progress" | "Resolved" | "Closed" | "Rejected" | undefined;
    assignedTo?: string | undefined;
}, {
    priority?: "Low" | "Medium" | "High" | "Critical" | undefined;
    status?: "Open" | "In Progress" | "Resolved" | "Closed" | "Rejected" | undefined;
    assignedTo?: string | undefined;
}>;
export declare const updateServiceRequestSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["Pending", "Approved", "In Progress", "Completed", "Rejected"]>>;
    priority: z.ZodOptional<z.ZodEnum<["Low", "Medium", "High", "Critical"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    priority?: "Low" | "Medium" | "High" | "Critical" | undefined;
    status?: "In Progress" | "Rejected" | "Pending" | "Approved" | "Completed" | undefined;
    assignedTo?: string | undefined;
}, {
    priority?: "Low" | "Medium" | "High" | "Critical" | undefined;
    status?: "In Progress" | "Rejected" | "Pending" | "Approved" | "Completed" | undefined;
    assignedTo?: string | undefined;
}>;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<["employee", "agent", "admin"]>;
    department: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    role: "employee" | "agent" | "admin";
    department?: string | undefined;
}, {
    email: string;
    password: string;
    name: string;
    role: "employee" | "agent" | "admin";
    department?: string | undefined;
}>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["Hardware", "Software"]>;
    subcategories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "Hardware" | "Software";
    subcategories?: string[] | undefined;
}, {
    name: string;
    type: "Hardware" | "Software";
    subcategories?: string[] | undefined;
}>;
export declare const commentSchema: z.ZodObject<{
    text: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    text: string;
    attachments?: string[] | undefined;
}, {
    text: string;
    attachments?: string[] | undefined;
}>;
//# sourceMappingURL=validation.util.d.ts.map