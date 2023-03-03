import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
    // return 'This action adds a new user';
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
    // return `This action returns all user`;
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: id });
    return user;
  }

  async findOrCreate(
    user: CreateUserDto,
    create = true,
  ): Promise<UserDocument> {
    const dbUser = await this.userModel.findOne({ email: user.email });
    const returnUser =
      !dbUser && create ? await this.userModel.create(user) : dbUser;
    return returnUser;
  }

  updateOne(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
