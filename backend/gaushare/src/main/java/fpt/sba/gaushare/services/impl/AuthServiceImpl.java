package fpt.sba.gaushare.services.impl;

import fpt.sba.gaushare.constants.enums.UserStatus;
import fpt.sba.gaushare.dto.requests.UserRegistrationDTO;
import fpt.sba.gaushare.dto.responses.RegistrationResponse;
import fpt.sba.gaushare.entities.User;
import fpt.sba.gaushare.mappers.UserMapper;
import fpt.sba.gaushare.repositories.RoleRepository;
import fpt.sba.gaushare.repositories.UserRepository;
import fpt.sba.gaushare.services.AuthService;
import fpt.sba.gaushare.services.EmailService;
import fpt.sba.gaushare.services.PasswordService;
import fpt.sba.gaushare.utils.IdEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final PasswordService passwordService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;

    private static final String DEFAULT_ROLE = "USER";
    private static final UserStatus DEFAULT_USER_STATUS = UserStatus.PENDING;
    private static final int OTP_LENGTH = 6;
    private static final int OTP_TTL_MINUTES = 30;

    @Override
    public RegistrationResponse registerUser(UserRegistrationDTO userRegistration) {
        User user = User.builder()
                .fullname(userRegistration.getFullname())
                .username(userRegistration.getUsername())
                .email(userRegistration.getEmail())
                .passwordHash(passwordService.hashPassword(userRegistration.getPassword()))
                .dateOfBirth(userRegistration.getDob())
                .role(roleRepository.findByName(DEFAULT_ROLE))
                .status(DEFAULT_USER_STATUS)
                .build();

        String otp = passwordService.generateOtp(userRegistration.getEmail(), OTP_LENGTH, OTP_TTL_MINUTES);

        User savedUser = userRepository.save(user);
        emailService.sendEmail(user.getEmail(),
                "Verify your email",
                "Your OTP code is: " + otp);

        return RegistrationResponse.builder()
                .userId(IdEncoder.encode(savedUser.getId()))
                .build();
    }
}
