package fpt.sba.gaushare.constants;

public class ValidationMessage {

    private ValidationMessage() {}

    public static final String FULLNAME_NOT_BLANK = "Tên không được để trống đâu bạn";
    public static final String EMAIL_NOT_BLANK = "Email đâu?";
    public static final String EMAIL_INVALID = "Email viết kiểu gì đấy?";
    public static final String USERNAME_NOT_BLANK = "Username là bắt buộc";
    public static final String USERNAME_SIZE = "Username từ 4-20 ký tự thôi";
    public static final String DOB_NOT_NULL = "Ngày sinh không được null";
    public static final String DOB_PAST = "Đến từ tương lai hả bạn?";
    public static final String PASSWORD_NOT_BLANK = "Password không được để trống";
    public static final String PASSWORD_SIZE = "Password ngắn quá, hack phút mốt";

}
