import mongoose, { Document } from 'mongoose';
import { TYPE } from '../config/constants';
export interface ICategory extends Document {
    name: string;
    type: typeof TYPE[keyof typeof TYPE];
    subcategories: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Category.model.d.ts.map