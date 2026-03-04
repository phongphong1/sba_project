package fpt.sba.gaushare.services.impl;
import fpt.sba.gaushare.constants.Message;
import fpt.sba.gaushare.constants.enums.UserStatus;
import fpt.sba.gaushare.dto.requests.AuthenticationRequest;
import fpt.sba.gaushare.dto.requests.UserRegistrationDTO;
import fpt.sba.gaushare.dto.requests.VerifyRequestDTO;
import fpt.sba.gaushare.dto.responses.AuthenticationResponse;
import fpt.sba.gaushare.dto.responses.RegistrationResponse;
import fpt.sba.gaushare.dto.responses.VerifyResponse;
import fpt.sba.gaushare.entities.Permission;
import fpt.sba.gaushare.entities.RefreshToken;
import fpt.sba.gaushare.entities.User;
import fpt.sba.gaushare.exceptions.AccountNotActiveException;
import fpt.sba.gaushare.exceptions.InvalidOtpException;
import fpt.sba.gaushare.exceptions.UserNotFoundException;
import fpt.sba.gaushare.repositories.RefreshTokenRepository;
import fpt.sba.gaushare.repositories.RoleRepository;
import fpt.sba.gaushare.repositories.UserRepository;
import fpt.sba.gaushare.services.AuthService;
import fpt.sba.gaushare.services.EmailService;
import fpt.sba.gaushare.services.PasswordService;
import fpt.sba.gaushare.utils.IdEncoder;
import fpt.sba.gaushare.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final PasswordService passwordService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private static final String DEFAULT_ROLE = "USER";
    private static final UserStatus DEFAULT_USER_STATUS = UserStatus.PENDING;
    private static final int OTP_LENGTH = 6;
    private static final int OTP_TTL_MINUTES = 30;

    @Value("${jwt.rt.expiration}")
    private long refreshTokenExpirationDays;

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

        User savedUser = userRepository.save(user);
        sendOtpEmail(userRegistration.getEmail(), "Verify your email");
        return RegistrationResponse.builder()
                .userId(IdEncoder.encode(savedUser.getId()))
                .build();
    }

    @Override
    public void sendOtpEmail(String email, String subject) {
        String otp = passwordService.generateOtp(email, OTP_LENGTH, OTP_TTL_MINUTES);
        User user = userRepository.findByEmail(email);
        HashMap<String, String> templateValues = new HashMap<>();
        templateValues.put("otpCode", otp);
        templateValues.put("name", user.getUsername());
        templateValues.put("expireTime", OTP_TTL_MINUTES + "");
        emailService.sendEmailWithTemplate(
                email,
                subject,
                "OTPMail",
                templateValues
        );
    }


    @Override
    public VerifyResponse verifyOtpCode(VerifyRequestDTO verifyRequestDTO) {
        // Validate OTP
        boolean isValid = passwordService.validateOtp(verifyRequestDTO.getEmail(), verifyRequestDTO.getOtpCode());
        if (!isValid) {
            throw new InvalidOtpException(Message.INVALID_OTP);
        }
        // Find user by email
        User user = userRepository.findByEmail(verifyRequestDTO.getEmail());
        if (user == null) {
            throw new UserNotFoundException(Message.USER_NOT_FOUND);
        }
        // Update user status and clean up OTP
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        passwordService.deleteOtp(verifyRequestDTO.getEmail());
        return VerifyResponse.builder()
                .userId(IdEncoder.encode(user.getId()))
                .success(true)
                .message(Message.OTP_VERIFIED_SUCCESS)
                .build();
    }

    @Override
    @Transactional
    public AuthenticationResponse login(AuthenticationRequest request) {
        // 1. Xác thực username/password - ném BadCredentialsException nếu sai
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 2. Lấy thông tin user
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UserNotFoundException(Message.USER_NOT_FOUND));

        // 3. Kiểm tra tài khoản đã được kích hoạt chưa
        if (!user.getStatus().equals(UserStatus.ACTIVE)) {
            throw new AccountNotActiveException(Message.USER_NOT_ACTIVE);
        }

        // 4. Generate access token và refresh token
        String accessToken = jwtUtil.generateToken(user);
        String rawRefreshToken = jwtUtil.generateRefreshToken(user);

        // 5. Xoá refresh token cũ và lưu refresh token mới vào DB
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setToken(rawRefreshToken);
        refreshTokenEntity.setExpiresAt(Instant.now().plus(refreshTokenExpirationDays, ChronoUnit.DAYS));
        refreshTokenRepository.save(refreshTokenEntity);

        // 6. Lấy danh sách permissions từ role của user
        List<String> permissions = user.getRole() != null && user.getRole().getPermissions() != null
                ? user.getRole().getPermissions().stream()
                        .map(Permission::getName)
                        .collect(Collectors.toList())
                : List.of();

        // 7. Trả về response
        return AuthenticationResponse.builder()
                .userId(IdEncoder.encode(user.getId()))
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .permissions(permissions)
                .build();
    }
}
