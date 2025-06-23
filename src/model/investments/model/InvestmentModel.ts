import mongoose from 'mongoose';
import { StockSchema } from '../schema/discriminators/StockSchema';
import InvestmentSchema from '../schema/InvestmentSchema';
import { MutualFundSchema } from '../schema/discriminators/MutualFundSchema';
import { BondSchema } from '../schema/discriminators/BondSchema';
import { PropertySchema } from '../schema/discriminators/PropertySchema';
import { BusinessSchema } from '../schema/discriminators/BusinessSchema';
import { FixedDepositSchema } from '../schema/discriminators/FixedDepositSchema';
import { EPFOSchema } from '../schema/discriminators/EPFOSchema';
import { GoldSchema } from '../schema/discriminators/GoldSchema';
import { ParkingFundSchema } from '../schema/discriminators/ParkingFundSchema';


export const InvestmentModel = mongoose.model('Investment', InvestmentSchema);

const StockModel = InvestmentModel.discriminator('STOCK', StockSchema);
const MutualFundModel = InvestmentModel.discriminator('MUTUAL_FUND', MutualFundSchema);
const BondModel = InvestmentModel.discriminator('BOND', BondSchema);
const PropertyModel = InvestmentModel.discriminator('PROPERTY', PropertySchema);
const BusinessModel = InvestmentModel.discriminator('BUSINESS', BusinessSchema);
const FixedDepositModel = InvestmentModel.discriminator('FIXED_DEPOSIT', FixedDepositSchema);
const EPFOModel = InvestmentModel.discriminator('EPFO', EPFOSchema);
const GoldModel = InvestmentModel.discriminator('GOLD', GoldSchema);
const ParkingFundModel = InvestmentModel.discriminator('PARKING_FUND', ParkingFundSchema);

export {
  StockModel,
  MutualFundModel,
  BondModel,
  PropertyModel,
  BusinessModel,
  FixedDepositModel,
  EPFOModel,
  GoldModel,
  ParkingFundModel,
};
