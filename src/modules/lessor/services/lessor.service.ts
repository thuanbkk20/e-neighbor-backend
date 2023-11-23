import { LessorNotFoundException } from 'src/exceptions';
import { LessorEntity } from '../domains/entities/lessor.entity';
import { LessorRepository } from './../repositories/lessor.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { LessorRegisterDto } from '../domains/dtos/create-lessor.dto';

@Injectable()
export class LessorService {
  constructor(
    private readonly lessorRepository: LessorRepository,
    private readonly userService: UserService,
  ) {}

  async findOneById(id: number): Promise<LessorEntity> {
    const lessor = await this.lessorRepository.findOneById(id);

    if (!lessor) {
      throw new LessorNotFoundException();
    }
    return lessor;
  }

  async findOneByUserId(id: number): Promise<LessorEntity> {
    const lessor = await this.lessorRepository.findOneByUserId(id);

    if (!lessor) {
      throw new LessorNotFoundException();
    }
    return lessor;
  }

  async registerLessor(registerDto: LessorRegisterDto) {
    const user = await this.userService.findOneById(registerDto.userId);
    if (user.role === 'lessor') {
      throw new BadRequestException('The account role is already lessor');
    }
    //Update user information
    const userAfterUpdate = await this.userService.registerLessor(registerDto);
    //Create new lessor record
    const lessor = {
      wareHouseAddress: registerDto.wareHouseAddress,

      description: registerDto.description,

      user: userAfterUpdate,
    };
    this.lessorRepository.save(lessor);
  }
}
