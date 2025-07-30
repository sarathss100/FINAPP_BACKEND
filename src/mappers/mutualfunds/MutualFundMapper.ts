import IMutualFundDTO from "../../dtos/mutualfunds/MutualFundDTO";
import IMutualFundDocument from "../../model/mutualfunds/interfaces/IMutualFund";

export default class MutualFundMapper {
  // Convert Mongo document to DTO
  static toDTO(data: IMutualFundDocument): IMutualFundDTO {
    return {
      scheme_code: data.scheme_code || '',
      scheme_name: data.scheme_name || '',
      net_asset_value: data.net_asset_value || 0,
      date: data.date || new Date(),
    };
  }

  // Convert list of Mongo documents to DTOs
  static toDTOs(data: IMutualFundDocument[]): IMutualFundDTO[] {
    return data.map(item => this.toDTO(item));
  }

  // Convert DTO to Mongoose model shape (Partial for create/update)
  static toModel(dto: Partial<IMutualFundDTO>): Partial<IMutualFundDocument> {
    const model: Partial<IMutualFundDocument> = {
      scheme_code: dto.scheme_code,
      scheme_name: dto.scheme_name,
      net_asset_value: dto.net_asset_value,
      date: dto.date,
    };

    return model;
  }

  // Convert list of Mongo documents to DTOs
  static toModels(data: IMutualFundDTO[]): Partial<IMutualFundDocument>[] {
    return data.map(item => this.toModel(item));
  }
}
