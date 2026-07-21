import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICostingRow {
  material: string;
  itemName: string;
  sqInchRate: number | null;
  quantity: number | null;
  unitPrice: number | null;
  total: number;
}

export interface ICosting extends Document {
  date: string;
  itemName: string;
  quantity: number;
  printMachine: string;
  artworkImage: string; // base64
  rows: ICostingRow[];
  cost: number;
  secondCost: number;
  grandTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const CostingRowSchema = new Schema<ICostingRow>({
  material: { type: String, required: true },
  itemName: { type: String, default: '' },
  sqInchRate: { type: Number, default: null },
  quantity: { type: Number, default: null },
  unitPrice: { type: Number, default: null },
  total: { type: Number, default: 0 },
});

const CostingSchema = new Schema<ICosting>(
  {
    date: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    printMachine: { type: String, required: true },
    artworkImage: { type: String, default: '' },
    rows: { type: [CostingRowSchema], required: true },
    cost: { type: Number, default: 0 },
    secondCost: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Costing: Model<ICosting> =
  mongoose.models.Costing || mongoose.model<ICosting>('Costing', CostingSchema);

export default Costing;
