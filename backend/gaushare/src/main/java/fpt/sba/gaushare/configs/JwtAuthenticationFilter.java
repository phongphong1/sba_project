package fpt.sba.gaushare.configs;

import fpt.sba.gaushare.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, @Lazy UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Lấy header Authorization ra
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. Kiểm tra xem header có null không, hoặc có bắt đầu bằng "Bearer " không
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Cắt bỏ chữ "Bearer " để lấy token "tinh khiết"
        jwt = authHeader.substring(7);

        // 4. Trích xuất username từ token
        username = jwtUtil.extractUsername(jwt);

        // 5. Kiểm tra:
        // - Có username không?
        // - Hiện tại SecurityContext đã có ai đăng nhập chưa? (null là chưa)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Lấy thông tin user từ DB lên
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 6. Validate token: Token chuẩn và user chuẩn
            if (jwtUtil.validateToken(jwt, userDetails)) {

                // Tạo object Authentication để thông báo cho Spring Security là "Thằng này uy tín"
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 7. Set Authentication vào Context -> User chính thức đăng nhập thành công cho request này
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 8. Chạy tiếp các filter khác trong chuỗi
        filterChain.doFilter(request, response);
    }
}
