import { Types } from 'mongoose';
import IUserDTO from '../../dtos/base/IUserDTO';
import IUserDocument from '../../model/user/interfaces/IUser';
import IAuthUserDTO from '../../dtos/auth/IAuthUserDTO';
import IProfileDTO from '../../dtos/user/IProfileDTO';
import IProfilePictureDTO from '../../dtos/user/IProfilePictureDTO';
import IAdminUserDTO from '../../dtos/admin/IAdminUserDTO';

export default class UserMapper {
  // Maps IUserDocument (Mongo model) to IUserDTO
  static toIUserDTO(data: IUserDocument): IUserDTO {
    const dto: IUserDTO = {
      _id: data._id.toString(),
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      password: data.password,
      role: data.role,
      is2FA: data.is2FA,
      isDeleted: data.isDeleted,
      status: data.status,
      profile_picture_url: data.profile_picture_url,
      profile_picture_id: data.profile_picture_id,
      subscription_status: data.subscription_status ? true : false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return dto;
  }

  // Maps IUserDocument (Mongo model) to IAdminUserDTO
  static toIAdminUserDTO(data: IUserDocument): IAdminUserDTO {
    const dto: IAdminUserDTO = {
      userId: data._id.toString(),
      firstName: data.first_name,
      lastName: data.last_name,
      phoneNumber: data.phone_number,
      role: data.role,
      status: data.status,
      twoFactorEnabled: data.is2FA,
    };

    return dto;
  }

  // Maps IUserDocument (Mongo model) to IAuthUserDTO
  static toIAuthUserDTO(data: IUserDocument): IAuthUserDTO {
    const dto: IAuthUserDTO = {
      userId: data._id.toString(),
      phoneNumber: data.phone_number,
      status: data.status,
      role: data.role,
      is2FA: data.is2FA,
      hashedPassword: data.password
    };

    return dto;
  }

  // Maps IUserDocument (Mongo model) to IProfileDTO
  static toIProfileDTO(data: IUserDocument): IProfileDTO {
    const dto: IProfileDTO = {
      userId: data._id.toString(),
      firstName: data.first_name,
      lastName: data.last_name,
      phoneNumber: data.phone_number,
      is2FA: data.is2FA,
      subscription_status: !!data.subscription_status,
      profilePictureUrl: data.profile_picture_url || '',
    };

    return dto;
  }

  // Maps IUserDocument (Mongo model) to IProfilePictureDTO
  static toIProfilePictureDTO(data: IUserDocument): IProfilePictureDTO {
    const dto: IProfilePictureDTO = {
      imageUrl: data.profile_picture_url || '',
      imageId: data.profile_picture_id || '',
    };

    return dto;
  }

  // Maps an array of IUserDocument to an array of IUserDTO
  static toDTOs(users: IUserDocument[]): IUserDTO[] {
    return users.map((user) => this.toIUserDTO(user));
  }

  // Maps an array of IUserDocument to an array of IAdminUserDTO
  static toAdminUserDTOs(users: IUserDocument[]): IAdminUserDTO[] {
    return users.map((user) => this.toIAdminUserDTO(user));
  }

  // Maps IUserDTO to Partial<IUserDocument> (for create/update)
  static toModel(dto: Partial<IUserDTO>): Partial<IUserDocument> {
    const model: Partial<IUserDocument> = {
      _id: dto._id,
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone_number: dto.phone_number,
      password: dto.password,
      role: dto.role,
      is2FA: dto.is2FA,
      isDeleted: dto.isDeleted,
      status: dto.status,
      profile_picture_url: dto.profile_picture_url,
      profile_picture_id: dto.profile_picture_id,
      subscription_status: dto.subscription_status,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };

    if (dto._id) {
      model._id = new Types.ObjectId(dto._id);
    }

    return model;
  }
}
