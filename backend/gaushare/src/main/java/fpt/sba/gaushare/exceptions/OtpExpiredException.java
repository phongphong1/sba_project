package fpt.sba.gaushare.exceptions;

public class OtpExpiredException extends OtpException {
    public OtpExpiredException(String message) {
        super(message);
    }

    public OtpExpiredException(String message, Throwable cause) {
        super(message, cause);
    }
}
