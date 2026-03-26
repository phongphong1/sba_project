package fpt.sba.devquest.config;

import fpt.sba.devquest.service.UserDetailsServiceImpl;
import fpt.sba.devquest.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class WebSocketJwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() != StompCommand.CONNECT) {
            return message;
        }

        String headerAuth = accessor.getFirstNativeHeader("Authorization");
        if (!StringUtils.hasText(headerAuth) || !headerAuth.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing Authorization header for websocket connection.");
        }

        String token = headerAuth.substring(7);
        if (!jwtUtils.validateJwtToken(token)) {
            throw new IllegalArgumentException("Invalid websocket token.");
        }

        String username = jwtUtils.getUserNameFromJwtToken(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        accessor.setUser(authentication);
        return message;
    }
}
