package fpt.sba.gaushare.exceptions;

public class InvalidOtpException extends OtpException {
    public InvalidOtpException(String message) {
        super(message);
    }

    public InvalidOtpException(String message, Throwable cause) {
        super(message, cause);
    }
}
