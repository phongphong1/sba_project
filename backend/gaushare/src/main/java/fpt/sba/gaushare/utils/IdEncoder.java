package fpt.sba.gaushare.utils;

import org.hashids.Hashids;
import org.springframework.beans.factory.annotation.Value;

public class IdEncoder {
    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int BASE = ALPHABET.length();

    @Value("${app.hash-salt}")
    private static String salt;

    private static final Hashids hashids = new Hashids(salt);


    public static String encode(Long num) {
        return hashids.encode(num);
    }

    public static Long decode(String str) {
        return hashids.decode(str)[0];
    }
}
