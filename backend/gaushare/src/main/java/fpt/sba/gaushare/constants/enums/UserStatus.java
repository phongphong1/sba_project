package fpt.sba.gaushare.constants.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.stream.Stream;

@Getter
@AllArgsConstructor
public enum UserStatus {
    ACTIVE("ACTIVE", "Active"),
    PENDING("PENDING", "Pending"),
    BANNED("BANNED", "Banned");

    private final String value;
    private final String displayName;

    public static UserStatus fromCode(String value) {
        return Stream.of(UserStatus.values())
                .filter(v -> v.getValue().equals(value))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
