package fpt.sba.gaushare.mappers;

import fpt.sba.gaushare.dto.requests.UserRegistrationDTO;
import fpt.sba.gaushare.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source="dob", target="dateOfBirth")
    User toEntity(UserRegistrationDTO userRegistrationDTO);

}
